CREATE TABLE precincts (
    precinct_id SERIAL PRIMARY KEY,
    precinct_name VARCHAR(100),
    total_population INT,
    white INT,
    black INT,
    asian INT,
    hispanic INT,
    democratic_votes INT,
    republican_votes INT,
    precinct_geometry GEOMETRY(Geometry, 4326)
);
