const wkt = require('wkt');
const { parse } = require('wkt');
import axios from 'axios';

// // const wkt = require('wkt');
// // const { parse } = require('wkt');
// const parse = require('wellknown');

axios.get('http://fairmaps.us-east-2.elasticbeanstalk.com/662ee9a00f0197d33c66dab3', )
      .then(response => {
        // Handle successful response
        console.log('Response:', wkt.parse(response.data));
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
});