const LinkedInScraper = require('../scrapers/LinkedInScraper.js')
const linkedinscraper = new LinkedInScraper()
//const IndeedScraper = require('../scrapers/IndeedScraper.js')
//const Indeedscraper = new IndeedScraper()

class ScraperService {
    constructor(){
        this.scrapers = [linkedinscraper]
    }

    async scrape(){
        return await Promise.all(this.scrapers.map(scraper=>{
            return scraper.getJobs()
        }))
    }

}

module.exports = ScraperService;