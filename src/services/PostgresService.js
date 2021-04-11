require('dotenv').config()
const pgPromise = require('pg-promise');
const pgp = pgPromise();
const uuid = require('uuid');


class PostgresService {
    initDB(){              
        const initOptions = {
            host: process.env.HOST,
            port: process.env.PORT,
            database: process.env.DATABASE,
            user: process.env.USERNAME,
            password: process.env.PASSWORD};
        
        return pgp(initOptions);
    }

    constructor(){
        this.db = this.initDB();
    }
   
    async getJobs() {
        const query = 'SELECT * FROM job;';
        const values = [];
        return this.run(query,values);
    }
   
    async saveJobs(jobs) {
        let valuePlaceholders,
            values = [],
            counter = 1;
        jobs.map(({title,seniority,url,posting_date})=>{
            valuePlaceholders = valuePlaceholders ? `${valuePlaceholders},($${counter++},$${counter++},$${counter++},$${counter++},$${counter++})` : `($${counter++},$${counter++},$${counter++},$${counter++},$${counter++})`;
            values.push(uuid.v1(),title,seniority,posting_date,url)
        })
        const query = `
        INSERT INTO job
            (ID, title, seniority, posting_date, url)
        VALUES 
            ${valuePlaceholders}
        ON CONFLICT DO NOTHING
        RETURNING 1`;
        return this.run(query,values);
    }
   
    async run(query,values) {
        return this.db.any(query,values);
    }
}

module.exports = PostgresService;