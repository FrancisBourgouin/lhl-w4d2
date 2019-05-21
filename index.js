const { Client } = require('pg');
const connectOptions = require('./connect_options');

// Creating the config to connect to postgres
const client = new Client(connectOptions);

// Connecting to the people db
// Using promises
client
  .connect()
  .then()
  .catch(err => console.log(err))
  .finally(() => console.log('People Database Connected'));

// Connecting to the people db
// Using callback

// client.connect(err => {
//   if (err) {
//     console.error('connection error', err.stack);
//   } else {
//     console.log('connected');
//   }
// });

// Get the arguments from the command line
const getArguments = () => {
  const [node, path, command, firstName, lastName] = process.argv;

  return { command, firstName, lastName };
};

// const addPerson = (personObj) => {
//   const { firstName, lastName } = personObj;
// Destructuring in the parameter, equivalent to this above

const addPerson = ({ firstName, lastName }) => {
  // Create the insert query to add to the database
  const query = {
    text: 'INSERT INTO people(first_name, last_name) VALUES($1, $2)',
    values: [firstName, lastName],
  };

  // Running the query with promises
  client
    .query(query)
    // Get the result of the insert Query
    .then(res =>
      console.log(`${res.rowCount} person has been added to the database.`)
    )
    // Catching any error
    .catch(err => console.log(err))
    // This always execute
    .finally(() => {
      console.log('query completed');
      // closing the connection
      client.end();
    });
};

const displayPerson = personObj => {
  console.log(
    `${personObj.id}- ${personObj.first_name} ${personObj.last_name}`
  );
};

const renderPeople = peopleArr => {
  console.log(`Listing ${peopleArr.length} persons`);
  console.log('-'.repeat(20));

  for (const person of peopleArr) {
    displayPerson(person);
  }
};

const listPeople = () => {
  // Creating the SELECT Query
  const query = {
    text: 'SELECT * from people',
  };

  // Running that query
  client
    .query(query)
    // Getting the result
    .then(res => renderPeople(res.rows))

    // Catching errors
    .catch(err => console.log(err))

    // Closing the connection
    .finally(() => {
      console.log('Query completed.');
      client.end();
    });
};

// Extracting the arguments
const { command, firstName, lastName } = getArguments();

switch (command) {
  case 'c':
    // Adding a new person in the database
    if (firstName && lastName) {
      addPerson({ firstName, lastName });
    } else {
      console.log('Please provide a first and last name');
      client.end();
    }
    break;

  case 'l':
    listPeople();
    break;

  // case 'd':
  //   deletePerson({firstName, lastName});
  //   break;

  default:
    console.log("Please specify the command, either 'c' or 'l' ");
    client.end();
}
