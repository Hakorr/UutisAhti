const Request = require('request');

const get = (url, callback) => {
  Request.get({url: url, json: true}, (err, res, data) => {
      if (err) {
          console.log('Error:', err);
          callback(null);
      } else if (res.statusCode !== 200) {
          console.log('Status:', res.statusCode, `(${url})`);
          callback(null);
      } else {
          callback(data);
      }
  });
};

module.exports = { get };