CREATE TABLE job (
    ID UUID PRIMARY KEY,
    title VARCHAR (50) NOT NULL,
    seniority VARCHAR (50) NOT NULL,
    url VARCHAR (200) NOT NULL,
    posting_date TIMESTAMPTZ NOT NULL,
    liked BOOLEAN
);




