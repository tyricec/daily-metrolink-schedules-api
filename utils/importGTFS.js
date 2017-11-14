const gtfs = require('gtfs');
const config = require('../config.json');

gtfs.import(config).then(() => {
  console.log('Import successful');
}).catch((err) => {
  console.log(err);
});

