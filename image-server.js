const express = require("express")

const app = express()
app.listen(8080, () => {
  console.log("image server listen 8080.")
})
app.use(express.static("./images"))
