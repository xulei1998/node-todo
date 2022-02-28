#!/usr/bin/env node
/* 入口 */
const program= require('commander');
const db = require('./db.js');
const api=require('./index.js')  //导入


/*命令行支持参数  */
/* 选项 */
program
  .option('-d, --debug', 'output extra debugging')

/* 子命令 */  
program
  .command('add')   //语法
  .description('add a task')   //功能描述：添加一个任务名
  .action((...args) => {
    const words=args.slice(0,-1).join(' ')    //不要最后一项，把add后输入的字符串用空格合并起来
    api.add(words).then(()=>{console.log('添加成功')},()=>{console.log('添加失败')})
  });

program
  .command('clear')   
  .description('clear all task')  //删除所有任务
  .action(() => {
    api.clear().then(()=>{console.log('清除完毕')},()=>{console.log('清除失败')})
  });

program.parse(process.argv);

if (process.argv.length===2){
  api.showAll()  //命令为node cli时，显示当前所有任务列表
}
