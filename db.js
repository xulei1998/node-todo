/* 封装好的实现细节 */
const homedir=require('os').homedir();
const home=process.env.HOME || homedir;  //获取系统的根目录 C:\Users\Administrator
const p=require('path')
const fs=require('fs')
const dbPath=p.join(home,'.todo')  //使 C:\Users\Administrator\.todo 作为数据库

const db={
  read(path=dbPath){
    return new Promise((resolve,reject)=>{
      fs.readFile(path,{flag:'a+'},(error,data)=>{
        if(error){  
          reject(error)   
        }else{
          let list
          try{
            list=JSON.parse(data.toString())
          }catch(error2){
            list=[]
          }
          resolve(list)
        }  
      })
    })
  },
  write(list,path=dbPath){
    return new Promise((resolve,reject)=>{
      const string=JSON.stringify(list)         //将当前任务转换成一个字符串
      fs.writeFile(path,string+'\n',(error)=>{  //把字符串写到这个文件里
        if(error){
          console.log(error)
          reject(error)
        }
        else{
          resolve()
        }
      })
    })
  }
}

module.exports=db 