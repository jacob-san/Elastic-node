const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    hosts: [ 'http://localhost:9200' ]
})

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const path = require('path');

client.ping({
    requestTimeout: 30000
}, function(err) {
    if(err) {
        console.log('elastic search cluster is down');
    }
    else {
        console.log('Everything is Ok');
    }
})

// use the bodyparser as a middleware  
app.use(bodyParser.json())
// set port for the app to listen on
app.set( 'port', process.env.PORT || 3001 );
// set path to serve static files
app.use( express.static( path.join( __dirname, 'public' )));
// enable CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// define base route and return with an HTML index.html
app.get('/', function(req, res){
    res.sendFile('template.html', {
        root: path.join(__dirname, 'views')
    })
})

app.get('/search', function(req, res){
    let body = {
        size: 200,
        from: 0,
        query: {
            match: {
                name: req.query['q']
            }
        }
    }

    // perform the actual search passing in the index, the search query and the type
    client.search({index: 'first-index', body: body, type: 'cities-list'})
    .then(results => {
        res.send(results.hits.hits);
    })
    .catch(err=>{
        console.log(err);
        res.send([]);
    })
})

// listen on the specified port
app .listen( app.get( 'port' ), function(){
    console.log( 'Express server listening on port ' + app.get( 'port' ));
  } );
