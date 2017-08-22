'use strict';

var mongo = require('mongodb').MongoClient
var Promise = require('bluebird')
var url = 'mongodb://localhost:27017/priv'
var db

connect()
.then(updateGeocoords)
.then(r => {
  db.close
  console.log("FIN")
})

function connect () {
  return new Promise((resolve, reject) => {
    mongo.connect(url, (err, _db) => { 
      if (err) reject (err)
      db = _db
      resolve(db)
    })
  })
}

function getAll () {
  return new Promise((resolve, reject) =>{
    db.collection('venues').find().toArray((e, data) => {
      if (e) reject (e)
      resolve(data)
    })
  })
}

function updateAll(data) {
  return Promise.all(data.map(venue => {
    
  }))
}
