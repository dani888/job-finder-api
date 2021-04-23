const cheerio = require('cheerio');
const axios = require('axios');

class FlexjobScraper {
    constructor(){

    }
    async getJobs(){
        return new Promise(async (resolve, reject) => {
            let paginationUrl = 'https://www.flexjobs.com/',
                search = `/search?jobtypes%5B%5D=Employee&location=Boston%2C+MA`,
                searchtwo = '&schedule%5B%5D=Full-Time&search=web+developer&will_travel%5B%5D=No',
                pagination = 1,
                paginationStep = 1,
                paginationQuery = '&page=',
                resultJobs = [];
            let $ = await this.getUrl(`${paginationUrl}${search}${paginationQuery}${pagination}${searchtwo}`)
            while ($('li.list-group-item.job').length) { 
                let newJobs = await this.parseJobs($)
                resultJobs = resultJobs.concat(newJobs)
                pagination += paginationStep
                $ = await this.getUrl(`${paginationUrl}${search}${paginationQuery}${pagination}${searchtwo}`)
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
            timeout = 2000;
        await Promise.all($('li.list-group-item.job').map((i,e)=>{
            return new Promise((resolve, reject) => {
                async function processPage() {
                    let url ="https://www.flexjobs.com/" + $(e).find('a.job-link').attr('href'),
                        jobPage = await _this.getUrl(url);
                    jobs.push({
                        title:$(e).find('div.col-12.col-lg-9').attr('h1'),
                        url:url,    
                        location:$(e).find('table.table.table-striped.table-sm mb-3 tbody tr td').eq(3),
                        posting_date:$(e).find('table.table.table-striped.table-sm mb-3 tbody tr td').eq(1),
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

module.exports = FlexjobScraper;