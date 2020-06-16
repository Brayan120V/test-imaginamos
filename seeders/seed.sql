/* CREATE DATABASE productionimaginamos;


\c productionimaginamos;
 */

BEGIN TRANSACTION;
CREATE TYPE service_type AS enum ('Maintenance', 'Installation');
CREATE TYPE status_type AS enum ('Completed', 'Working', 'Waiting');
CREATE TYPE person_type AS enum ('Technical', 'Client');

CREATE TABLE person(
id int8 not null,
name VARCHAR(50) not null,
phone VARCHAR(10) not null,
role person_type,
password VARCHAR(70) not null,
PRIMARY KEY(id)
);

CREATE TABLE ticket(
idticket serial not null,
client_person_id int8 not null,
createdat timestamp not null,
PRIMARY KEY(idticket),
FOREIGN KEY(client_person_id) REFERENCES person(id)
); 

CREATE TABLE service(
idservice serial not null,  
ticket_idticket int8 not null unique,
technical_person_id int8 not null,
client_person_id int8 not null,
type service_type not null,
status status_type default 'Waiting',
address VARCHAR(50) not null,
requestat date not null,
rate float,
PRIMARY KEY(idservice),
FOREIGN KEY(ticket_idticket) REFERENCES ticket(idticket),
FOREIGN KEY(technical_person_id) REFERENCES person(id),
FOREIGN KEY(client_person_id) REFERENCES person(id)
);

COMMIT;
