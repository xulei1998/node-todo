/* 所有功能的实现  */
const db=require('./db.js')
const inquirer=require('inquirer')

module.exports.add =async(title)=>{   //async 异步操作
  const list=await db.read()  //读取之前的任务
  list.push({title:title,done:false})  //往里面添加一个新的title任务
  await db.write(list)  //存储任务到文件
}

module.exports.clear=async()=>{  //清除所有任务
  await db.write([])
}
function markAsDone(list,index){
  list[index].done=true
  db.write(list)
}
function markAsUndone(list,index){
  list[index].done=false
  db.write(list)
}
function updateTitle(list,index){
  inquirer.prompt({
    type:'input',
    name:'title',
    message:'请拟一个新标题',
    default:list[index].title
  }).then(answer=>{
    list[index].title=(answer.title)
    db.write(list)
  })
}
function remove(list,index){
  list.splice(index,1)
  db.write(list)
}

function askForAction(list,index){  //询问接下来的操作
  inquirer.prompt({
    type:'list',
    name:'action',
    message:'请选择操作',
    choices:[
      {name:'退出',value:'quit'},
      {name:'已完成',value:'markAsDone'},
      {name:'未完成',value:'markAsUndone'},
      {name:'改标题',value:'updateTitle'},
      {name:'删除',value:'remove'},
    ]
  }).then(answer2=>{
    switch(answer2.action){
      case 'quit':
        break;
      case 'markAsDone':
        markAsDone(list,index)
        break;
      case 'markAsUndone':
        markAsUndone(list,index)
        break;
      case 'updateTitle':
        updateTitle(list,index)
        break;
      case 'remove':
        remove(list,index)
        break;
    }
  })
}
function printTasks(list){
  inquirer
  .prompt({
    type: 'list',
    name: 'index',
    message: '请选择你想操作的任务', 
    choices: [{name:'退出',value:'-1'},...list.map((task,index)=>{
      return {name:`${task.done? '[√]':'[x]' } ${index+1} - ${task.title}`,value:index}
    }),{name:'+ 创建任务',value:'-2'}]
  })
  .then((answer) => {
    const index=parseInt(answer.index)
    if(answer.index>=0){       //选中了一个任务(非“退出”和“新建任务”)
      askForAction(list,index) //询问对这个任务的操作
    }else if(index===-2){
      askForCreateTask(list)   //创建新任务

    }
  });
}
function askForCreateTask(list){ 
  inquirer.prompt({
    type:'input',
    name:'title',
    message:'请输入任务标题'
  }).then(answer=>{
    list.push({
      title:answer.title,
      done:false
    })
    db.write(list)
  })
}
module.exports.showAll=async()=>{
   const list=await db.read()  //读取之前的任务
   printTasks(list)   //打印显示之前的任务
 
}