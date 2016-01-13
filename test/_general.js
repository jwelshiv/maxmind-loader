var should    = require('should');
var maxloader = require('../maxmind-loader.js');
var fs        = require('fs');
var geofile   = '/tmp/GeoLite.dat';
var geofilegz = geofile + '.gz';

describe('maxmind-loader', function() {
  // clean up from prior run
  if (fs.existsSync(geofile)) {
    fs.unlinkSync(geofile);
  }
  if (fs.existsSync(geofilegz)) {
    fs.unlinkSync(geofilegz);
  }

  var exists;

  describe('cleanup test data', function() {
    it(geofilegz + " should not exist", function(){
      exists = (fs.existsSync(geofilegz));
      exists.should.not.be.equal(true);
    });

    it(geofile + " should not exist", function(){
      exists = (fs.existsSync(geofile));
      exists.should.not.be.equal(true);
    });
  });

  describe('should', function() {
    beforeEach(function(done){
      this.timeout(1 * 60 * 1000);
      maxloader({
        dest: geofile
      }, function(err) {
        if (err) {
          console.log(err);
        }
        done();
      });
    });

    it("load without errors", function(){
      var exists = fs.existsSync(geofile);
      exists.should.equal(true);
    });
  });
});
