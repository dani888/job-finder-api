const cheerio = require('cheerio');
const axios = require('axios');

class LinkedInScraper {
    constructor(){

    }
    async getJobs(){
        let paginationUrl = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search',
            search = `?keywords=Web%2BDeveloper&location=Lexington%2C%2BMassachusetts%2C%2BUnited%2BStates&geoId=104181684&trk=public_jobs_jobs-search-bar_search-submit&f_E=2%2C3&f_SB2=2&f_PP=102380872%2C104180134%2C104597301&f_JT=F&sortBy=DD&position=1&pageNum=0`,
            pagination = 0,
            paginationStep = 25,
            paginationQuery = '&start=',
            resultJobs = [];
        let $ = await this.getUrl(`${paginationUrl}${search}${paginationQuery}${pagination}`)
        while ($('li.result-card.job-result-card').length) {
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
        await Promise.all($('li.result-card.job-result-card').map((i,e)=>{
            return new Promise((resolve, reject) => {
                async function processPage() {
                    let url = $(e).find('a.result-card__full-card-link').attr('href'),
                        jobPage = await _this.getUrl(url);
                    jobs.push({
                        title:$(e).find('h3.result-card__title.job-result-card__title').text(),
                        url:url,
                        location:$(this).find('span.job-result-card__location').text(),
                        posting_date:$(e).find('time.job-result-card__listdate--new,time.job-result-card__listdate').attr('datetime'),
                        seniority:jobPage('span.job-criteria__text.job-criteria__text--criteria').first().text()
                    })
                    resolve()
                }
                setTimeout(processPage,timeout*i);
            });
        }));
        return jobs
    }
}

module.exports = LinkedInScraper;