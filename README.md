Get maxmind paid and lite geoip data updates

## Install :hammer:

```
npm install maxmind-loader
```

## Usage :wrench:

```javascript
var maxloader = require('maxmind-loader');

maxloader(callback);

// default values shown
maxloader({
	license: undefined, // maxmind license string for paid data otherwise free version loaded
	day:     'tuesday', // day of the week to load for paid subscription
	edition: 132,       // paid subscription edition
	dest:    '/tmp/'    // should load /tmp/GeoCityLite.dat, async operation
}, function (err, filepath) {
	if (err) {
		console.log(err);
	} else {
		console.log(filepath, 'loaded');
	}
});
```

## Free Geo Data Example :wrench:

```javascript
var maxmind   = require('maxmind')
  , maxloader = require('maxmind-loader');

maxloader(function(error, filepath) {
	maxmind.init(filepath); // intialize with /tmp/GeoLiteCity.dat
});
```

## Paid Geo Data Example :wrench:

```javascript
var options = { license: 'MAXMIND_LICENSE' };

maxloader(options, function(err, filepath) {
	if (err) {
		console.log(err);
	} else {
		maxmind.init(filepath, { memoryCache: true });
	}
})
```
