const express = require('express')
const app = express()
const port = 7282

app.get('/', (req, res) => {
  res.sendfile('index.ntml')
})