const cheerio = require('cheerio');
const axios = require('axios');
const dayjs = require('dayjs');

class FlexjobScraper {
    constructor(){

    }
    async getJobs(){
        return new Promise(async (resolve, reject) => {
            let paginationUrl = 'https://www.flexjobs.com/search',
                search = `?career_level%5B%5D=Entry-Level&jobtypes%5B%5D=Employee&location=Boston%2C+MA&schedule%5B%5D=Full-Time&search=web+developer&will_travel%5B%5D=No`,
                pagination = 1,
                paginationStep = 1,
                paginationQuery = '&page=',
                resultJobs = [];
            let $ = await this.getUrl(`${paginationUrl}${search}${paginationQuery}${pagination}`)
            while ($('li.list-group-item.job').length) { 
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
        let response = await axios.get(url,{headers})
        const $ = cheerio.load(response.data);
        return $
    }
    async parseJobs($){ 
        let jobs = [],
            _this = this,
            timeout = 3000;
        await Promise.all($('li.list-group-item.job').map((i,e)=>{
            return new Promise((resolve, reject) => {
                async function processPage() {
                    let url ="https://www.flexjobs.com" + $(e).find('a.job-link').attr('href'),
                        jobPage = await _this.getUrl(url);
                    jobs.push({
                        title:jobPage('div.col-12.col-lg-9 h1').text(),
                        url:url,    
                        location:jobPage('table.job-details tbody tr td').eq(2).children().remove().end().text(),
                        posting_date:dayjs(jobPage('table.job-details tbody tr td').eq(0).text()) || dayjs(),
                        seniority:jobPage('table.job-details tbody tr td').eq(5).text(),
                        employment_type:jobPage('table.job-details tbody tr td').eq(4).text()
                    })
                    resolve()
                }
                setTimeout(processPage,timeout*i);
            });
        }));
        return jobs
    }
}

module.exports = FlexjobScraper;