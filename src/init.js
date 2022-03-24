const {loadingWrapper, chalk, log, exec} = require('./constants')


module.exports = async (...params) => {
  log(chalk.blue(params))

  await loadingWrapper('install...', exec, 'npm install')
  log(chalk.green('install dependencies complete.'))


  await exec('npm run build')
  log(chalk.green('build application complete.'))

}
