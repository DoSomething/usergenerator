# User Generator
### Need test data? This tool has you covered.

#### Install
`git clone https://github.com/DoSomething/usergenerator.git`

`npm install`

`mkdir secrets`
`cp example.secrets.json secrets/staging.json`

Feel free to create additional profiles in the secrets folder for other env's and test cases. 

#### Usage
| Argument      | Description   | Default |
| ------------- |:-------------:| ------: |
| --campaign    | campaign NID  | 1485    |
| --run         | campaign run  | 1860    |
| --secrets     | secret to use | staging |
| -u (total)    | Users to make | 5       |
| -s            | Create signups| false   |
| -r            | Create RB's   | false   |
| -g            | Gladiate users| false   |
| -l            | Log data      | true    |

**Example**

```
node app.js -s -r -g --campaign 5 --run 10 -u 12 --secrets prod
{
  campaign: 5,
  run: 10,
  totalUsers: 12,
  signup: true,
  reportback: true,
  gladiator: true,
  log: true,
  secrets: prod
}
```
