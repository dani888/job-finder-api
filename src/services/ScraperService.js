const LinkedInScraper = require('../scrapers/LinkedInScraper.js')
const linkedinscraper = new LinkedInScraper()

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