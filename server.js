const net = require("node:net")
const http = require("node:http")
const { writeFile } = require("node:fs")
const path = require('node:path')
const { argv } = require('node:process')
const uuid = require('uuid')

const db = require("./db")
const { request } = require("node:http")

http.get('http://mongo-local:3001/api/config/list', {}, (res) => {
  // console.log('res:', res)
  if (res.statusCode === 200) {
    let rawData = ''
    res.on('data', (chunk) => {
      rawData += chunk
    })
    res.on('end', () => {
      console.log('receive data end:', rawData)
      const configList = JSON.parse(rawData)
      configList.forEach((c) => createServer(c))
    })
  }
})

const sendRequest = (postData) => {
  const request = http.request('http://mongo-local:3001/api/add', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    console.log('Add api call in upload server:', res.statusCode)  
  })
  request.write(postData)
  request.end()
}

const createServer = ({ place, port }) => {
  let currentChunk = Buffer.alloc(0)
  const server = net.createServer((c) => {
    console.log("client connected")
    c.on("end", () => {
      const timestamp = new Date().getTime()
      const fileName = `image-${timestamp}.jpeg`
      const filePath = path.resolve(__dirname, `./images/${fileName}`)
      const postData = JSON.stringify({
        name: fileName,
        relativePath: `${fileName}`,
        physicalPath: filePath,
        date: timestamp,
        timestamp,
        place,
      })   
      console.log("data end")
      sendRequest(postData)
      writeFile(filePath, currentChunk, (err) => {
        if (err) throw err
        console.log("The file has been saved!")
      })
      currentChunk = Buffer.alloc(0)
    })
    c.write("hello\r\n")
    c.pipe(c)
    c.on("data", (chunk) => {
      currentChunk = Buffer.concat([currentChunk, chunk])
      const timestamp = new Date().getTime()
      const fileName = `image-${timestamp}.jpeg`
      const filePath = path.resolve(__dirname, `./images/${fileName}`)
    })
  })
  server.on("error", (err) => {
    throw err
  })
  server.listen(port, () => {
    console.log("server bound, listening ", port)
  })
}

