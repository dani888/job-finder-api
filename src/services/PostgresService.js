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
        const query = `SELECT * FROM job WHERE title NOT LIKE '%Senior%' 
                    AND title NOT LIKE '%SENIOR%' 
                    AND title NOT LIKE '%senior%' 
                    AND title NOT LIKE '%Sr%'
                    AND title NOT LIKE '%Lead%';`
        const values = [];
        return this.run(query,values);
    }
   
    async saveJobs(jobs) {
        let valuePlaceholders,
            values = [],
            counter = 1;
        jobs.map(({title,seniority,employment_type, url, location, posting_date})=>{
            valuePlaceholders = valuePlaceholders ? `${valuePlaceholders},($${counter++},$${counter++},$${counter++},$${counter++},$${counter++},$${counter++},$${counter++})` : `($${counter++},$${counter++},$${counter++},$${counter++},$${counter++},$${counter++},$${counter++})`;
            values.push(uuid.v1(),title,seniority,posting_date,url, location,employment_type)
        })
        const query = `
        INSERT INTO job
            (ID, title, seniority, posting_date, url, location, employment_type)
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