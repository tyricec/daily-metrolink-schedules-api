const gtfs = require('gtfs');
const config = require('../config.json');

config.mongoUrl = process.env.MONGODB_URI || config.mongoUrl;

gtfs.import(config).then(() => {
  console.log('Import successful');
}).catch((err) => {
  console.log(err);
});

