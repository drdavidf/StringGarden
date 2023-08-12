import pg from 'pg'
 
const client = new pg.Client({
  user: 'davidf',
  host: 'localhost',
  database: 'scoredb',
  password: 'psql',
  port: 5432,
})
 
await client.connect()
 
console.log(await client.query('SELECT * from game'))
 
await client.end()
