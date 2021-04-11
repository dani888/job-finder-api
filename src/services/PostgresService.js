require('dotenv').config()
const pgPromise = require('pg-promise');
const pgp = pgPromise();


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
   
    async run(query,values) {
        return this.db.any(query,values);
    }
}

module.exports = PostgresService;