const cheerio = require('cheerio');
const axios = require('axios');

class LinkedInScraper {
    constructor(){

    }
    async getHtml(){
        let html = await axios.get('https://www.linkedin.com/jobs/search?keywords=Web%2BDeveloper&location=Lexington%2C%2BMassachusetts%2C%2BUnited%2BStates&geoId=104181684&trk=public_jobs_jobs-search-bar_search-submit&f_E=2%2C3&f_SB2=2&f_PP=102380872%2C104180134%2C104597301&f_JT=F&sortBy=DD&position=1&pageNum=0');
        return cheerio.load(html.data);
    }
    async getJobs(){
        const $ = await this.getHtml();
        let jobs = []
        $('li.result-card.job-result-card').each(function (i, e) {
            jobs.push({
                title:$(this).find('h3.result-card__title.job-result-card__title').text(),
                url:$(this).find('a.result-card__full-card-link').attr('href'),
                posting_date:$(this).find('time.job-result-card__listdate--new,time.job-result-card__listdate').attr('datetime'),
                seniority:"" //TODO
            })
        });
        return jobs
    }
}

module.exports = LinkedInScraper;