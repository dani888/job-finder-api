const LinkedInScraper = require('../scrapers/LinkedInScraper.js')
const linkedinscraper = new LinkedInScraper()
const IndeedScraper = require('../scrapers/IndeedScraper.js')
const indeedScraper = new IndeedScraper()
const FlexjobScraper = require('../scrapers/FlexjobScraper.js')
const flexjobScraper = new FlexjobScraper()
// const LinkupScraper = require('../scrapers/LinkupScraper.js')
// const linkupScraper = new LinkupScraper()
const GlassdoorScraper = require('../scrapers/GlassdoorScraper.js')
const glassdoorScraper = new GlassdoorScraper()
const RoberHalfScraper = require('../scrapers/RoberHalfScraper.js')
const roberHalfScraper = new RoberHalfScraper()

class ScraperService {
    constructor(){
        this.scrapers = [roberHalfScraper]
    }

    async scrape(){
        return await Promise.all(this.scrapers.map(scraper=>{
            return scraper.getJobs()
        }))
    }

}

module.exports = ScraperService;