const { Client } = require('pg');
const connectOptions = require('./connect_options');

// connect pg
const client = new Client(connectOptions);

const createNewPerson = (firstName, lastName, cb) => {
  const queryText =
    'INSERT INTO people (first_name, last_name) VALUES ($1, $2) RETURNING *';
  client.query(queryText, [firstName, lastName], (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      cb(res);
      client.end();
    }
  });
};

const listPeople = cb => {
  const queryText = 'SELECT * FROM people ORDER BY last_name, first_name asc';

  client.query(queryText, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      cb(res);
      client.end();
    }
  });
};

const printPeople = peopleArr => {
  console.log('Listing all the people');

  for (const person of peopleArr) {
    console.log(
      `id: ${person.id} First Name: ${person.first_name} Last Name: ${
        person.last_name
      }`
    );
  }
};

client.connect(err => {
  if (err) {
    throw err;
  }

  const [node, path, command, firstName, lastName] = process.argv;

  if (!command) {
    console.log('Syntax for command-line arguments: c|l <firstName lastName>');
    process.exit(1);
  }

  switch (command.toLowerCase()) {
    case 'c':
      createNewPerson(firstName, lastName, res => {
        console.log(
          `${res.rowCount} rows have been inserted into ${client.database}`
        );
        console.log(res.rows[0]);
      });
      break;
    case 'l':
      listPeople(res => printPeople(res.rows));
      break;
    default:
      console.log('Unknow command');
      client.end();
      process.exit(1);
  }

  console.log(`Postgres connected to ${client.database} database`);
});
