CREATE TABLE liked (
    ID UUID PRIMARY KEY,
    refID UUID References job;
);
/* "SELECT * FROM j.jobs l.liked
WHERE j.ID = l.refID  and j.title NOT LIKE '%Senior%' 
                    AND j.title NOT LIKE '%SENIOR%' 
                    AND j.title NOT LIKE '%senior%' 
                    AND j.title NOT LIKE '%Sr%'
                    AND j.title NOT LIKE '%Lead%';" */


CREATE TABLE applied (
    ID UUID PRIMARY KEY,
    refID UUID References job;
);

/* "SELECT * FROM j.jobs a.applied
WHERE j.ID = l.refID and j.title NOT LIKE '%Senior%' 
                    AND j.title NOT LIKE '%SENIOR%' 
                    AND j.title NOT LIKE '%senior%' 
                    AND j.title NOT LIKE '%Sr%'
                    AND j.title NOT LIKE '%Lead%';" */

CREATE TABLE passed (
    ID UUID PRIMARY KEY,
    refID UUID References job;
);

/* "SELECT * FROM j.jobs p.passed
WHERE j.ID = l.refID" and j.title NOT LIKE '%Senior%' 
                    AND j.title NOT LIKE '%SENIOR%' 
                    AND j.title NOT LIKE '%senior%' 
                    AND j.title NOT LIKE '%Sr%'
                    AND j.title NOT LIKE '%Lead%';"*/
















