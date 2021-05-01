const cheerio = require('cheerio');
const axios = require('axios');

class GlassdoorScraper {
    constructor(){

    }
    async getJobs(){
        return new Promise(async (resolve, reject) => {
            let paginationUrl = 'https://www.glassdoor.com/Job/boston-web-developer-jobs-SRCH_IL.0,6_IC1154532_KO7,20',
                paginationUrlExtension = '.htm',
                search = `?jobType=fulltime&seniorityType=entrylevel&minSalary=30000&includeNoSalaryJobs=true&maxSalary=92000`,
                pagination = 1,
                paginationStep = 1,
                paginationQuery = '_IP',
                resultJobs = [];
            let $ = await this.getUrl(`${paginationUrl}${paginationQuery}${pagination}${paginationUrlExtension}${search}`)
            while ($('li.react-job-listing').length) { 
                let newJobs = await this.parseJobs($)
                resultJobs = resultJobs.concat(newJobs)
                pagination += paginationStep
                $ = await this.getUrl(`${paginationUrl}${paginationQuery}${pagination}${paginationUrlExtension}${search}`)
            }
            resolve(resultJobs)
        })
    }
    async getUrl(url){
        console.log(url);
        let headers = {
            'User-Agent':"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36"
        }
        let response = await axios.get(url,{headers})
        const $ = cheerio.load(response.data);
        return $
    }
    async parseJobs($){ 
        let jobs = [],
            _this = this,
            timeout = 2000;
        await Promise.all($('li.react-job-listing').map((i,e)=>{
            return new Promise((resolve, reject) => {
                async function processPage() {
                    let url ="https://www.glassdoor.com" + $(e).find('div.d-flex.justify-content-between.align-items-start a').attr('href'),
                        jobPage = await _this.getUrl(url);
                    jobs.push({
                        title:jobPage('div.css-17x2pwl.e11nt52q6').text(),
                        url:url,    
                        location:$(e).find('span.pr-xxsm.css-1ndif2q.e1rrn5ka0').text(),
                        posting_date:$(e).find('div.d-flex.align-items-end.pl-std.css-mi55ob').first().text(),
                        seniority:"Entry Level",
                        employment_type:jobPage('span.css-sr4ps0.e18tf5om4').first().text()
                    })
                    resolve()
                }
                setTimeout(processPage,timeout*i);
            });
        }));
        return jobs
    }
}

module.exports = GlassdoorScraper;