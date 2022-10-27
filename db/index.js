const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs')

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'recording';

async function connect() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  
  
}

async function insert(document) {
  const db = client.db(dbName);
  const collection = db.collection('list');
  const list = await collection.find().toArray()
  console.log('list:', list)
  collection.insertOne(document)
}

async function insertFile(sourceFilePath, fileName) {
  const db = client.db(dbName);
  const bucket = new GridFSBucket(db, { bucketName: 'myCustomBucket' });
  fs.createReadStream(sourceFilePath).
     pipe(bucket.openUploadStream(fileName, {
         chunkSizeBytes: 1048576,
         metadata: { field: 'myField', value: 'myValue' }
     }));
}

module.exports = {
  insert,
  insertFile
}
