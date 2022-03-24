// 存放常量
const ora = require('ora') // loading
const chalk = require('chalk')
const shell = require('shelljs')
const {promisify} = require('util')
const {version} = require('../package.json')

const loadingWrapper = async (msg = 'loading...', callback, ...params) => {
  const spinner = ora(msg).start();
  const res = await callback(...params)
  spinner.succeed()
  return res
}

//  存储模板的位置: cenOS | window
const dir = process.env[process.platform === 'darwin' ? 'HOME' : 'USERRPROFILE']
const downloadDirectory = `${dir}/template`
console.log(downloadDirectory);
module.exports = {
  log: console.log,
  chalk,
  version,
  downloadDirectory,
  loadingWrapper,
  exec: promisify(shell.exec)
}
