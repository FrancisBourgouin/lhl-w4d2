# Command-Line App Working with PG

The apps will accept command-line arguments 'c'reate or 'l'ist. 'c' will accept first name and last name and the app performs an
inser query. 'l' will run a select query and returns the rows that will be printed out at the terminal.

## config

- install pg

`npm install --save pg`

- create a file **connect_options** and export an object containing database name, user, password

- make sure `connect_options.js` is in `.gitignore`

- require pg and require connected options

```js
const { Client } = require('pg');
const connectOptions = require('./connect_options');
```

- look at the documentation to do the client.connect

[Connecting](https://node-postgres.com/features/connecting)
[pg.Client](https://node-postgres.com/api/client)

## Queries

### Insert Query

- Get first name, last name from command line
- Create the insert query. Refer to this doc:

[Queries](https://node-postgres.com/features/queries)
