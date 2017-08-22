'use strict';

var mongo = require('mongodb').MongoClient
var Promise = require('bluebird')
var url = 'mongodb://localhost:27017/priv'
var ObjectID = require('mongodb').ObjectID
var db

connect()
.then(getAll)
.then(updateAll)
.then(r => {
  db.close()
  console.log(r)
  console.log("FIN")
  //process.exit()
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
    console.log("==>OBJECT ID?", venue._id)
    db.collection('venues').findOneAndUpdate(
      {"_id": ObjectID(venue._id)},
      {
        $set: {
          "address.location": {
            "type": "Point",
            "coordinates" : [venue.address.coord[0], venue.address.coord[1] ]
          }
        }
      },
      (err, oldVenue) => {
        if (err) {
          console.error("ERRR===>", err)
          process.exit()
          return Promise.reject(err)
        }
        console.log("==> REsolving", oldVenue)
        return Promise.resolve(oldVenue)
      }
    )}))
}
