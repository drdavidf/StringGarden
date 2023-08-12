var pg = require('pg'); 
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
 
const client = new pg.Client({
  user: 'davidf',
  host: 'localhost',
  database: 'scoredb',
  password: 'psql',
  port: 5432,
})
 
 
app.get('/players', function (req, res) {
      res.end( 'alice' );
});

app.get('/games', function(req, res) {
	client.query('SELECT * from game').then((val) => res.send(val.rows))
});

app.get('/player/:pid/game/:gid/state', function(req, res) {
	query = 'SELECT max(score) as score,level from session WHERE player = $1 AND game = $2 GROUP BY level'; 

	args = [req.params.pid, req.params.gid];

	client.query(query, args).then((val) => { res.send(val.rows)}) 
});

app.put('/player/:pid/game/:gid/level/:lid', function(req, res) {
	query = 'INSERT INTO session VALUES($1, $2, NOW(), $3, $4);'
	args = [ req.body.score, req.params.lid, req.params.pid, req.params.gid]
	client.query(query, args).then((val) => { res.send(val.rows)})
});

app.get('/player/:pid/game/:gid/level/:lid/current', function(req, res) {
	query = 'SELECT score from session WHERE time = (SELECT max(time) FROM session) AND player = $1 AND game = $2 AND level = $3'
	
	args = [req.params.pid, req.params.gid, req.params.lid];
	client.query(query, args).then((val) => { res.send(val.rows)})
});

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	client.connect().then(() => 
	console.log("Score server listening at http://%s:%s", host, port))
})
