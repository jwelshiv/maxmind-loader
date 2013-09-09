                 require('date-utils');                // JerrySievert/node-date-utils
var fs         = require('fs')
  , wgetjs     = require('wgetjs')                     // angleman/wgetjs
  , uncompress = require('compress-buffer').uncompress // egorfine/node-compress-buffer, used because decompress doesn't support just .gz
  , untar      = require('untar')                      // package/untar
;




function maxloader(options, callback) {

	if (typeof options === 'function') {
		callback = options;
		options  = {};
	};
	options         = options         || {};
	callback    	= callback        || options.callback || function() {};
	options.timeout = options.timeout || 15 * 60 * 1000; // 15 minutes instead of 2 second default
	if (typeof options.extract === 'undefined') {
		options.extract = true;
	}
	var edition     = options.edition || 132
	  , offsets     = { su:0, mo:6, tu:5, we:4, th: 3, fr: 2, sa: 1 }
	  , day_offset  = (options.day) ? options.day.substr(0.2).toLowerCase() : 'tu'
	  , pre         = 'http://www.maxmind.com/app/download_new?edition_id=' + edition + '&date='
	  , date        = new Date()
	  , offset      = 0 - (offsets[day_offset] + date.getDay()) // days to prior day (tuesday)
	;
	date.addDays(offset);
	var year    = date.getFullYear()
	  , month   = date.getMonth()+1
	  , day     = date.getDate();
	month       = (month > 9) ? month : '0' + month;
	day         = (day > 9) ? day : '0' + day;
	var date    = year + month + day
	  , post    ="&suffix=tar.gz&license_key=" + options.license
	  , source  = options.source || pre + date + post
	;
	options.url = (options.license) ? source : 'http://geolite.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz';

	if (options.extract) {
		wgetjs(options, extract);
	} else {
		wgetjs(options, callback);
	}

	function extract(error, response, body) {
		if (error) {
			console.log(error);
			callback(error, response, body);
		} else if (!response || !response.headers) {
			console.log('missing response headers');
			error = new Error('missing response headers');
			callback(error, response, body);
		} else if (response.headers['content-length'] < 1000000) { // to small?
			console.log('content-length: ' + response.headers['content-length']);
			error = new Error('content-length < 1000000: ' + response.headers['content-length']);
			callback(error, response, body);
		}
		options.dry = true; // dry run, doesn't retrieve a remote file but does generate the destination filename
		wgetjs(options, function(err, res, data) { // get the destination filename
			var outFile      = data.dest.replace('.gz', '');
			var rawData      = fs.readFileSync(data.dest); // todo: find async version
			var uncompressed = uncompress(rawData);
			fs.writeFile(outFile, uncompressed, function(err) {
				if (outFile != outFile.replace('.tar', '').replace('download_new', '')) {
				    var tarsrc = fs.createReadStream(outFile);
					var result = untar('/tmp', tarsrc);
					result.node(function(err, value){
						callback(err, response, value);
					})
				} else {
					callback(err, response, body);
				}
			});
		});
	}
}

module.exports = maxloader;