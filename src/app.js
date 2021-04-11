const express = require('express')
const app = express()
const port = 8080
const PostgresService = require('./services/PostgresService.js')
const pgservice = new PostgresService()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/get-jobs', async (req, res) => {
  let result = await pgservice.getJobs()
  res.json(result);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})