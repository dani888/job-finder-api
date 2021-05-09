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
        const query = `
        SELECT 
            j.*,
            case when a.id IS NOT NULL then 'TRUE' else 'FALSE' end as appied,
            case when l.id IS NOT NULL then 'TRUE' else 'FALSE' end as liked,
            case when p.id IS NOT NULL then 'TRUE' else 'FALSE' end as passed
        FROM job j
        LEFT JOIN applied a
            ON a.job_id = j.id
        LEFT JOIN liked l
            ON l.job_id = j.id
        LEFT JOIN passed p
            ON p.job_id = j.id
        WHERE 
            j.title NOT LIKE '%Senior%' 
        AND 
            j.title NOT LIKE '%SENIOR%' 
        AND 
            j.title NOT LIKE '%senior%' 
        AND 
            j.title NOT LIKE '%Sr%'
        AND 
            j.title NOT LIKE '%Lead%';`
        const values = [];
        return this.run(query,values);
    }

    async createTag(jobId, table){
        const id = uuid.v1();
        const query = `
        INSERT INTO ${table}
            (ID, job_id)
        VALUES
            ($1,$2)
        ON CONFLICT DO NOTHING;`
        const values = [id, jobId];
        return this.run(query,values);
    }
    async deleteTag(jobId, table){
        const query = `
        DELETE FROM ${table}
        WHERE
            job_id = $1;`
        const values = [jobId];
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