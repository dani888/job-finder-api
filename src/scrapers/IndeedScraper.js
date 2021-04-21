const cheerio = require('cheerio');
const axios = require('axios');

class IndeedScraper {
    constructor(){

    }
    async getJobs(){
        let paginationUrl = 'https://www.indeed.com/',
            search = `jobs?q=web+developer+$60,000&l=Boston,+MA&jt=fulltime&explvl=entry_level`,
            pagination = 0,
            paginationStep = 10,
            paginationQuery = '&start=',
            resultJobs = [];
        let $ = await this.getUrl(`${paginationUrl}${search}${paginationQuery}${pagination}`)
        while ($('div.jobsearch-SerpJobCard').length) { //li.result-card.job-result-card
            let newJobs = await this.parseJobs($)
            resultJobs = resultJobs.concat(newJobs)
            pagination += paginationStep
            $ = await this.getUrl(`${paginationUrl}${search}${paginationQuery}${pagination}`)
        }
        return resultJobs
    }
    async getUrl(url){
        console.log(url);
        let headers = {
            'User-Agent':"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36"
        }
        let response = await axios.get(url,headers)
        const $ = cheerio.load(response.data);
        return $
    }
    async parseJobs($){
        let jobs = [],
            _this = this,
            timeout = 500;
        await Promise.all($('div.jobsearch-SerpJobCard').map((i,e)=>{
            return new Promise((resolve, reject) => {
                async function processPage() {
                    let url = $(e).find('a.jobtitle.turnstileLink').attr('href'),
                        jobPage = await _this.getUrl(url);
                    jobs.push({
                        title:$(e).find('a.jobtitle.turnstileLink').text(),
                        url:url,
                        location:$(e).find('span.location.accessible-contrast-color-location').text(),
                        posting_date:$(e).find('span.date date-a11y').text(),
                        seniority:"Entry level",
                        employment_type:jobPage('div.jobsearch-JobDescriptionSection-sectionItem').text()
                    })
                    resolve()
                }
                setTimeout(processPage,timeout*i);
            });
        }));
        return jobs
    }
}

module.exports = IndeedScraper;