CREATE TABLE job (
    ID UUID PRIMARY KEY,
    title TEXT NOT NULL,
    seniority TEXT NOT NULL,
    url TEXT NOT NULL,
    location TEXT NOT NULL, 
    posting_date TIMESTAMPTZ NOT NULL,
	CONSTRAINT duplicate_job UNIQUE (title,posting_date)
);



    