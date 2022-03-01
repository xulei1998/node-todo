const db=require('../db.js')    //引入我们要测试的db.js
const fs=require('fs')
jest.mock('fs')

describe('db',()=>{
  it('can read', async () => {
    const data = [{title: 'hi', done: true}]
    fs.setReadFileMock('/xxx', null, JSON.stringify(data))
    const list = await db.read('/xxx')
    expect(list).toStrictEqual(data)
  })
  it('can write', async () => {
    let fakeFile  //此时假文件undefined
    fs.setWriteFileMock('/yyy', (path, data, callback) => { //对/yyy文件写，其实是写到fakeFile里
      fakeFile = data  
      callback(null)
    })
    const list = [{title: '去公园跑步', done: true}, {title: '去超市买食物', done: true}]
    await db.write(list, '/yyy')  //把db里的内容也写到/yyy文件里
    expect(fakeFile).toBe(JSON.stringify(list) + '\n')  //期待fakeFile里的内容是否为这个/yyy里的内容
  })
})