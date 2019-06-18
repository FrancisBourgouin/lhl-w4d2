const { Client } = require('pg')
const connect_options = require('./connect_options')
// const {database,host, user, password, port} = require('./connect_options')

const [executor, superpath, actionIwantToDo, firstName, lastName] = process.argv
// const executor = process.argv[0]
// const superpath = process.argv[1]

const client = new Client(connect_options)
console.log(executor, superpath, actionIwantToDo, firstName, lastName)

function readFromDatabase(){
    client.query('SELECT * FROM people', (err, res) => {
        // console.log(err ? err.stack : res)
        if (err) {
            console.log(err.stack)
        }
        else {
            // console.log(res.rows)
            const rows = res.rows
            for (const row of rows) {
                const { id, first_name, last_name } = row
                console.log(`Hi user #${id}, your first name is ${first_name} and your last is ${last_name}. Enjoy.`)
            }
        }
        client.end()
    })
}
function writeToDatabase(fname, lname){
    const query = {
        text: 'INSERT INTO people(first_name, last_name) VALUES($1, $2)',
        values: [fname, lname],
    }
    client.query(query, (err, res) => {
        console.log(err ? err.stack : res)
        client.end()
    })    
}

client.connect()
switch (process.argv[2]) {
    case 'read':
        readFromDatabase()
        break
    case 'add':
        writeToDatabase(process.argv[3], process.argv[4])
        break
    default:
        console.log('You need to enter \'read\' or \'add\' ')
        client.end()
}
