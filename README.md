# VCRecorder

This is a library to record your test suite's HTTP interactions and replay them during future test runs for fast, deterministic, accurate tests, it is an attempt of [vcr](https://github.com/vcr/vcr) for Ruby.

## Usage

- Run the command `npm install vcrecorder` use the flag `--save` to add your `package.json` file.
- Example test code using [lab](https://github.com/hapijs/lab) and [code](https://github.com/hapijs/code) in [HapiJS](http://hapijs.com/):

```javascript

var Lab = require('lab');
var Code = require('code');
var Vcr = require('vcrecorder');
var Hapi = require('hapi');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

// Other config code ...

var lab = exports.lab = Lab.script();
var request, server;

describe('Test Thirdy-party API', function () {
    
    it('Get my list of resources', function (done) {

        var server = new Hapi.Server();
        server.connection();

        server.start(function (err) {
            
            expect(err).to.not.exist();

            Vcr.insert('resources'); // Create or load the cassette of resources

            server.inject("/resources", function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.be.an.object();

                // Write data recorded in the cassette if not exist
                Vcr.eject(function (rec) {
                    
                    done();
                });
            });   
        });
    });
});

```


---

Create with :heart: by [Yalo](https://github.com/yalochat)