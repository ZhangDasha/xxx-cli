/**
 * Created by ZhangDaxiang on 2022/3/24
 */
const {loadingWrapper, chalk, log, exec} = require('./constants')
module.exports = async (...params) => {

  const [type = 'undefined'] = params

  const obj = {
    'vue': {
      'shell': 'npm run serve',
      'localPort': 'http://localhost:8080'
    },
    'quickapp': {
      'shell': 'npm run server',
      'localPort': 'http://localhost:8000/preview'
    },
    'undefined': {
      'shell': 'npm run server',
      'localPort': 'http://localhost:8080'
    }
  }

  exec(obj[type].shell)

  // todo: 如何准确的监听到 server 启动完成 ?
  setTimeout(async () => {
    await exec(`/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --incognito --auto-open-devtools-for-tabs ${obj[type].localPort}`)
  }, 3000)
}
