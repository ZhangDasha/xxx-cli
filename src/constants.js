// 存放常量
const {version} = require('../package.json')

//  存储模板的位置: cenOS | window
const dir = process.env[process.platform === 'darwin' ? 'HOME' : 'USERRPROFILE']
const downloadDirectory = `${dir}/template`
console.log(downloadDirectory);
module.exports = {
  version,
  downloadDirectory
}
