// Load Modules

var Path = require('path');
var Fs = require('fs');
var Nock = require('nock');
var Hoek = require('hoek');
var AppRoot = require('app-root-path');

// Declare internals

var internals = {
    attributes: {
        name: 'VCRecorder'
    },
    config: {
        directory: 'test/cassettes',
        extension: 'js',
        nock: {
            dont_print: false,
            output_objects: true
        }
    },
    recording: false,
    pathFile: ''
};

internals.generatePath = function (name) {

    return Path.join(AppRoot.path, internals.config.directory, name + '.' + internals.config.extension);
};

internals.existsFile = function (filePath) {

    return Fs.existsSync(filePath);
};

internals.startRecord = function () {

    Nock.cleanAll();
    Nock.restore();

    internals.recording = true;
    
    Nock.recorder.rec(internals.config.nock);
};

exports.setConfig = function(config) {
    internals.config = Hoek.applyToDefaults(internals.config, config);
};

exports.insert = function (name) {
    
    internals.pathFile = internals.generatePath(name);
    
    if (internals.existsFile(internals.pathFile)) {
        Nock.load(internals.pathFile);
    } else {
        if (! internals.recording) {
            internals.startRecord();
        };
    };
};

exports.eject = function (done) {
    
    if(! internals.existsFile(internals.pathFile)) {
        var calls = Nock.recorder.play();
        var data = JSON.stringify(calls);
        Nock.recorder.clear();

        Fs.writeFile(internals.pathFile, data, function (err) {
            
            if (err) {
                return done(err);
            };

            Nock.cleanAll();

            return done(calls);
        });
    } else {
        return done();
    };
};
