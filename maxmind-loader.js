var fs = require('fs');
var request = require('request');
var zlib = require('zlib');
var tar = require('tar');
var path = require('path');

require('date-utils');

function maxloader(options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options  = {};
	};
	options = options || {};
 	options.dest = options.dest || '/tmp/';

 	// 15 minutes instead of 2 second default
	options.timeout = options.timeout || 15 * 60 * 1000;

	if (typeof options.extract === 'undefined') {
		options.extract = true;
	}

	var edition = options.edition || 132;
	var offsets = { su:0, mo:6, tu:5, we:4, th: 3, fr: 2, sa: 1 };
	var day_offset = (options.day) ? options.day.substr(0.2).toLowerCase() : 'tu';
	var pre = 'http://www.maxmind.com/app/download_new?edition_id=' + edition + '&date=';
	var date = new Date();
	var offset = 0 - (offsets[day_offset] + date.getDay());

	date.addDays(offset);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	month = (month > 9) ? month : '0' + month;
	day = (day > 9) ? day : '0' + day;
	var date = year + month + day;
	var post = "&suffix=tar.gz&license_key=" + options.license;
	var source = options.source || pre + date + post;

	options.url = (options.license) ? source : 'http://geolite.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz';

	function untar (tarsrc, outdir, outFile) {
		fs.createReadStream(tarsrc)
		  .pipe(tar.Extract({ path: outdir }))
		  .on("error", function (err) {
			  returnError(err);
		  })
		  .on("end", function () {
				if (validateDatFile(outFile)) {
					if (callback) {
						callback(null, outFile);
					}
				}
		  });
	}

	var req = request(options);

	req.on('error', callback);

	req.on('response', function (res) {
    if (res.statusCode !== 200) throw new Error('Status not 200')

    var encoding = res.headers['content-encoding']
    if (encoding == 'gzip') {
      res.pipe(zlib.createGunzip()).pipe(outStream)
    } else if (encoding == 'deflate') {
      res.pipe(zlib.createInflate()).pipe(outStream)
    } else {
      res.pipe(outStream)
    }
  })

  req.on('end', function (err) {
  	callback(err, outStream);
  });

  var outStream = fs.createWriteStream(options.dest);
}

module.exports = maxloader;
