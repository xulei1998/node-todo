const fs = jest.genMockFromModule('fs')
const _fs = jest.requireActual('fs')
Object.assign(fs, _fs)

let readMocks = {}

fs.setReadFileMock = (path, error, data) => {
  readMocks[path] = [error, data]
}

/* 读文件 */
fs.readFile = (path, options, callback) => {
  if (callback === undefined) {callback = options}  //如果最后一个参数没传
  if (path in readMocks) {
    callback(...readMocks[path])
  } else {
    _fs.readFile(path, options, callback)
  }
}

let writeMocks = {}
/* 如果不真正地写到文件里，写到测试的mock的fn里   */
fs.setWriteFileMock = (path, fn) => {
  writeMocks[path] = fn
}

fs.writeFile = (path, data, options, callback) => {
  if (path in writeMocks) {  //使用writeMocks测试
    writeMocks[path](path, data, options, callback)  
  } else {
    _fs.writeFile(path, data, options, callback)  //调用真正的fs
  }
}

fs.clearMocks = () => {
  readMocks = {}
  writeMocks = {}
}


module.exports = fs