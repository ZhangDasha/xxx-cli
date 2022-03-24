// 1、解析用户参数
const path = require('path')
const program = require('commander')
const {version, loadingWrapper, chalk, log, exec} = require('./constants')


/**********************  start  ************************/
// 例：用 create 或 c 创建
program
  .command('create') // 配置命令的名字
  .alias('c')  // 命令的别名
  .description('create a file') // 命令的描述
  .action(() => {
    log(chalk.green('create file'))
    // Eg: da_cli create xx --> [node, da_cli, xx]
    require(path.resolve(__dirname, 'create'))(...process.argv.slice(3))
  })
/**********************  end  ************************/


/**********************  start  ************************/
// 例：init project
program
  .command('init')
  .alias('i')
  .description('project install and build')
  .action(async () => {
    require(path.resolve(__dirname, 'init'))(...process.argv.slice(3))
  })


// 例：open the project server
program
  .command('server')
  .alias('s')
  .description('project run server')
  .action(async () => {
    // server
    require(path.resolve(__dirname, 'server'))(...process.argv.slice(3))


  })

/**********************  end  ************************/


/**********************  start  ************************/
// 命令集
/*const mapAction = {
  create: {
    alias: 'c',
    description: 'create a file',
    examples: [
      'da_cli create <file name>'
    ]
  },
  config: {
    alias: 'conf',
    description: 'config project variable',
    examples: [
      'da_cli config set <k> <v>',
      'da_cli config get <k>'
    ]
  },
  // 兜底
  "*": {
    alias: '',
    description: 'command not found',
    examples:[]
  }
}

Reflect.ownKeys(mapAction).forEach((action) => {
  program
    .command(action)
    .alias(mapAction[action].alias)
    .description(mapAction[action].description)
    .action(() => {
      if(action === '*') {
        log(chalk.red(mapAction[action].description))
      } else {
        log(chalk.blue(action))
        // Eg: da_cli create xx --> [node, da_cli, xx]
        require(path.resolve(__dirname, action))(...process.argv.slice(3))
      }
    })
})

// 监听用户 help 事件
program.on('--help', () => {
  log(chalk.bgGray('\n Examples:'))
  Reflect.ownKeys(mapAction).forEach((action) => {
    mapAction[action].examples.forEach(item => {
      log(chalk.gray(item))
    })
  })
})*/
/**********************  end  ************************/


process.on('unhandledRejection', error => {
  log(chalk.red(error));
  process.exit(0)
});


/**********************  start  ************************/
// 解析用户参数
program.version(version).parse(process.argv)
/**********************  end  ************************/
