const express = require('express')
const app = express()
const port = 8080
const PostgresService = require('./services/PostgresService.js')
const ScraperService = require('./services/ScraperService.js')
const pgservice = new PostgresService()
const scraperService = new ScraperService()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/get-jobs', async (req, res) => {
  let result = await pgservice.getJobs()
  res.json(result);
})

app.get('/test-scraper', async (req, res) => {
  let results = await scraperService.scrape()
  results.map(async result=>await pgservice.saveJobs(result))
  res.json(results.flat());
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})