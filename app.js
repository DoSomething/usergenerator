var secrets = require(__dirname + '/secrets');
var request = require('superagent');
var Chance = require('chance');
var chance = new Chance();
var argv = require('minimist')(process.argv.slice(2));

var settings = {};
settings.campaign = argv.campaign || '1485';
settings.run = argv.run || '1860';
settings.totalUsers = argv.u || 5;
settings.signup = argv.s || false;
settings.reportback = argv.r || false;
settings.gladiator = argv.g || false;
settings.log = argv.l || true;

var NORTHSTAR_URL = secrets.northstar_url + '/' + secrets.northstar_version + '/';
var NORTHSTAR_API_KEY = secrets.northstar_key;

var PHOENIX_URL = secrets.phoenix_url + '/' + secrets.phoenix_version + '/';
var PHOENIX_USER = secrets.phoenix_username;
var PHOENIX_PASSWORD = secrets.phoenix_password;

var GLADIATOR_URL = secrets.gladiator_url + '/' + secrets.gladiator_version + '/';
var GLADIATOR_KEY = secrets.gladiator_key;

var phoenixSettings = {
  token: "",
  sessid: "",
  session_name: ""
}

var users = [];

function makeNorthstarPostRequest(url, data, callback) {
  request
  .post(NORTHSTAR_URL + url)
  .send(data)
  .set('X-DS-REST-API-Key', NORTHSTAR_API_KEY)
  .set('Accept', 'application/json')
  .end(function(err, res){
    if (err) {
      console.log(err);
      return;
    }
    callback(res.body);
  });
}

function makePhoenixPostRequest(url, data, callback) {
  request
    .post(PHOENIX_URL + url)
    .send(data)
    .set('X-CSRF-Token', phoenixSettings.token)
    .set("Cookie", phoenixSettings.session_name + "=" + phoenixSettings.sessid)
    .end(function(err, res) {
      if (err) {
        console.log(err);
        return;
      }

      callback(res.data);
    });
}

function makeGladiatorRequest(url, data, callback) {
  request
  .post(GLADIATOR_URL + url)
  .send(data)
  .set('X-DS-Gladiator-API-Key', GLADIATOR_KEY)
  .set('Accept', 'application/json')
  .end(function(err, res){
    if (err) {
      console.log(err);
      return;
    }
    callback(res.body);
  });
}

function createUser() {
  makeNorthstarPostRequest('users?create_drupal_user=1', {
    'email': chance.email(),
    'mobile': chance.phone(),
    'password': chance.string({length: 8, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'}),
    'birthdate': chance.birthday({string: true}),
    'first_name': chance.first(),
    'last_name': chance.last(),
    'country': chance.country()
  }, function (res) {
    var user = res.data;
    users.push(user);

    if (settings.log) {
      console.log("Created " + user.id);
    }

    if (settings.signup) {
      signupUser(user);
    }

    if (users.length >= settings.totalUsers) {
      return;
    }
    else {
      createUser();
    }
  });
}

function signupUser(user) {
  makePhoenixPostRequest('campaigns/' + settings.campaign + '/signup', {
    uid: user.drupal_id
  }, function(data) {
    if (settings.log) {
      console.log("Signed up " + user.id + ", " + user.drupal_id);
    }

    if (settings.reportback) {
      reportbackUser(user);
    }
    else if (settings.gladiator) {
      gladiatorUser(user);
    }
  });
}

function reportbackUser(user) {
  makePhoenixPostRequest('campaigns/' + settings.campaign + '/reportback', {
    uid: user.drupal_id,
    nid: settings.campaigns,
    quantity: chance.integer({min: 0, max: 100}),
    why_participated: chance.sentence(),
    file_url: 'http://thecatapi.com/api/images/get?format=src&type=png', //random cat image
    caption: chance.sentence()
  }, function(data) {
    if (settings.log) {
      console.log("Reported back " + user.id + ", " + user.drupal_id);
    }

    if (settings.gladiator) {
      gladiatorUser(user);
    }
  });
}

function gladiatorUser(user) {
  makeGladiatorRequest('users', {
    id: user.id,
    term: 'id',
    campaign_id: settings.campaign,
    campaign_run_id: settings.run
  }, function(res) {
    console.log("Gladiated user " + user.id);
  });
}

request
  .post(PHOENIX_URL + 'auth/login')
  .send({'username': PHOENIX_USER, 'password': PHOENIX_PASSWORD})
  .end(function(err, res) {
    if (err) {
      console.log(err);
      return;
    }

    phoenixSettings.sessid = res.body.sessid;
    phoenixSettings.session_name = res.body.session_name;
    phoenixSettings.token = res.body.token;

    createUser();
  });
