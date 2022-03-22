/**
 * 2022/3/21
 * @Author: ZhangDaxiang
 * @description: create
 *  拉取远程仓库模板
 */
const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const axios = require('axios')
const ora = require('ora') // loading
const inquirer = require('inquirer')
const metalsmith = require('metalsmith') // 遍历文件夹
let {render} = require('consolidate').ejs  // 模板引擎
let ncp = require('ncp') // 拷贝
let downloadGitRepo = require('download-git-repo')
const {downloadDirectory} = require('./constants')

// 可以把异步的 api 转化为 promise
downloadGitRepo = promisify(downloadGitRepo)
ncp = promisify(ncp)
render = promisify(render)

// https://api.github.com/
const temp = {
  'vue-template': 'https://api.github.com/repos/ZhangDasha/vue-template',
  'vue-simple-template': 'https://api.github.com/repos/ZhangDasha/vue-simple-template',
  'quickapp-template': 'https://api.github.com/repos/ZhangDasha/quickapp-template'
}


const sleep = (timer = 0) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}

// 抓取 tag 列表
const fetchTagList = async (repo) => {
  const {data} = await axios.get(temp[repo] + '/tags')
  return data
}

// 下载模板
const download = async (repo, tag) => {
  let api = `ZhangDasha/${repo}`
  if (tag) {
    api += `#${tag}`
  }

  // /user/apple/.template/repo
  const dest = `${downloadDirectory}/${repo}`
  await downloadGitRepo(api, dest)
  return dest
}

const loadingWrapper = async (msg = 'loading...', callback, ...params) => {
  const spinner = ora(msg).start();
  const res = await callback(...params)
  spinner.succeed()
  return res
}

module.exports = async (fileName) => {
  // 1、获取项目模板
  const repos = ['vue-template', 'vue-simple-template', 'quickapp-template']

  // 2、选择模板
  await loadingWrapper('下载中...', sleep, 800)

  const {repo} = await inquirer.prompt({
    name: 'repo', // 获取选择后的结果
    type: 'list',
    message: 'please choice a template to create project',
    choices: repos
  })


  // 选择版本号
  const tags = await loadingWrapper('获取版本号...', fetchTagList, repo)

  const {tag} = await inquirer.prompt({
    name: 'tag', // 获取选择后的结果
    type: 'list',
    message: 'please choice a tag to create project',
    choices: tags
  })


  // 下载模板到本地
  const res_dir = await loadingWrapper('模板下载中...', download, repo, tag)

  // 如果不存在 ask
  if (!fs.existsSync(path.join(res_dir, 'ask.json'))) {
    // 把 template 下文件，拷贝到执行命令的目录下
    await loadingWrapper('', ncp, res_dir, path.resolve(fileName))
  } else {
    // 如果存在 ask 文件就是一个复杂模板
    // 1、让用户填信息
    await new Promise((resolve, reject) => {
      metalsmith(__dirname) // 如果传入路径，默认遍历当前路径下 src 文件
        .source(res_dir)
        .ignore(['.*'])
        .destination(path.resolve(fileName)) // 目的地
        .use(async (files, metal, done) => {
          const args = require(path.join(res_dir, 'ask.json'))
          let result = await inquirer.prompt(args)
          // 获取用户输入
          Object.assign(metal.metadata(), result, {version:tag})
          // console.log(result)

          // 是否创建证书
          if (!result.sign) {
            delete files['sign/release/certificate.pem']
            delete files['sign/release/private.pem']
          }
          // 删除 ask
          delete files['ask.json']
          done()
        })
        // 2、渲染模板
        .use((files, metal, done) => {
          // 获取上一次 use 中数据
          // console.log(metal.metadata());
          let obj = metal.metadata()

          Reflect.ownKeys(files).forEach(async file => {
            // 获取包含 <% 的文件
            if (file.includes('js') || file.includes('json')) {
              let content = files[file].contents.toString() // 获取文件内容
              if (content.includes('<%')) { // 模板渲染
                content = await render(content, obj)
                files[file].contents = Buffer.from(content)
              }
            }
          })
          done()
        })
        .build((err) => {
          if (err) {
            reject()
          } else {
            resolve()
          }
        })
    })
  }
}
