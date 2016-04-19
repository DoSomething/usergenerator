# User Generator
### Need test data? This tool has you covered.

#### Install
`git clone https://github.com/DoSomething/usergenerator.git`

`npm install`

`cp examples.secrets.json secrets.json`

These secrets can be staging or local dev specific.

#### Usage
| Argument      | Description   | Default |
| ------------- |:-------------:| ------: |
| --campaign    | campaign NID  | 1485    |
| --run         | campaign run  | 1860    |
| -u (total)    | Users to make | 5       |
| -s            | Create signups| false   |
| -r            | Create RB's   | false   |
| -g            | Gladiate users| false   |
| -l            | Log data      | true    |

**Example**

```
node app.js -s -r -g --campaign 5 --run 10 -u 12
{
  campaign: 5,
  run: 10,
  totalUsers: 12,
  signup: true,
  reportback: true,
  gladiator: true,
  log: true
}
```
