var should    = require('should')
  , maxloader = require('../maxmind-loader.js')
;



describe('load free', function() {
    describe('successful loading GeoLiteCity.dat.gz', function() {

        var flag = false;
        beforeEach(function(done){
            this.timeout(2 * 60 * 1000); // 2 minutes
            maxloader({dest: '/tmp/'}, function(error, response) {
                flag = (error) ? error : true;
                done(); // complete the async beforeEach
            });

        });   

        it("flag should be true", function(){    
            flag.should.equal(true);  
        }); 

    });

});