CREATE TABLE liked (
    ID UUID PRIMARY KEY,
    job_id UUID UNIQUE References job(ID)
);



CREATE TABLE applied (
    ID UUID PRIMARY KEY,
    job_id UUID UNIQUE References job(ID)
);


CREATE TABLE passed (
    ID UUID PRIMARY KEY,
    job_id UUID UNIQUE References job(ID)
);


















