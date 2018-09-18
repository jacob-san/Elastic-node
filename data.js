// Require elasticsearch
const elasticsearch = require('elasticsearch');
const cities = require('./cities.json');

// Instantiate an elasticsearch client
const client = new elasticsearch.Client({
    hosts: [ 'http://localhost:9200' ]
});

client.ping({
    requestTimeout: 30000
}, function(err) {
    if(err) {
        console.error('Elastic search cluster is down');
    }
    else {
        console.log('Everything is Ok');
    }
})

// create index
client.indices.create({
    index: 'first-index'
}, function(err, response) {
    if(err) {
        console.log("Erring",err);
    }
    else {
        console.log('created a new index', response);
    }
})

//loop through each city and create and push two objects into the array in each loop
//first object sends the index and type you will be saving the data as
//second object is the data you want to index

var bulk = [];
cities.forEach(city => {
    bulk.push({index: {
        _index: 'first-index',
        _type: 'cities-list'
    }})
    bulk.push(city);
})

//perform bulk indexing of the data passed
client.bulk({ body: bulk }, function(err, response) {
    if(err) {
        console.log('Failed bulk operation', err);
    }
    else {
        console.log('Successfully imported as %s', cities.length);
    }
})