const cheerio = require('cheerio');
const axios = require('axios');

class IndeedScraper {
    constructor(){

    }
    async getJobs(){
        return new Promise(async (resolve, reject) => {
            let paginationUrl = 'https://www.indeed.com/',
                search = `jobs?q=web+developer+$60,000&l=Boston,+MA&jt=fulltime&explvl=entry_level`,
                pagination = 0,
                paginationStep = 10,
                paginationQuery = '&start=',
                resultJobs = [];
            let $ = await this.getUrl(`${paginationUrl}${search}${paginationQuery}${pagination}`)
            while ($('div.jobsearch-SerpJobCard').length) { 
                let newJobs = await this.parseJobs($)
                resultJobs = resultJobs.concat(newJobs)
                pagination += paginationStep
                $ = await this.getUrl(`${paginationUrl}${search}${paginationQuery}${pagination}`)
            }
            resolve(resultJobs)
        })
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
            timeout = 3000;
        await Promise.all($('div.jobsearch-SerpJobCard').map((i,e)=>{
            return new Promise((resolve, reject) => {
                async function processPage() {
                    let url ="https://www.indeed.com" + $(e).find('h2 a.jobtitle.turnstileLink').attr('href'),
                        jobPage = await _this.getUrl(url);
                    jobs.push({
                        title:$(e).find('h2 a.jobtitle.turnstileLink').attr('title'),
                        url:url,    
                        location:$(e).find('div.recJobLoc').attr('data-rc-loc'),
                        posting_date:$(e).find('span.date.date-a11y').text(),
                        seniority:"Entry level",
                        employment_type:"Full Time"
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