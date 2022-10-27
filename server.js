const net = require("node:net")
const { writeFile } = require("node:fs")
const path = require('node:path')
const { argv } = require('node:process')

const db = require("./db")

const port = argv[2] && Number(argv[2]) || 9000
const placeId = argv[3] && Number(argv[3]) || 1
const timestamp = new Date().getTime()

const server = net.createServer((c) => {
  console.log("client connected")
  c.on("end", () => {
    console.log("client disconnected")
  })
  c.write("hello\r\n")
  c.pipe(c)
  c.on("data", (chunk) => {
    const fileName = `image-${timestamp}.jpeg`
    const filePath = path.resolve(__dirname, `./images/${fileName}`)
    writeFile(filePath, chunk, (err) => {
      if (err) throw err
      console.log("The file has been saved!")
    })
    db.insert({
      name: fileName,
      relativePath: `${fileName}`,
      physicalPath: filePath,
      date: timestamp,
      place: placeId
    }).then(() => {
      console.log("insert done...")
    })
  })
})
server.on("error", (err) => {
  throw err
})
server.listen(port, () => {
  console.log("server bound, listening ", port)
})
