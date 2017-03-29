// Load Modules

const Path = require('path');
const Fs = require('fs');
const Nock = require('nock');
const Hoek = require('hoek');
const AppRoot = require('app-root-path');

// Declare internals

const internals = {
    attributes: {
        name: 'VCRecorder'
    },
    config: {
        directory: 'test/cassettes',
        extension: 'json',
        nock: {
            dont_print: true,
            output_objects: true
        }
    },
    recording: false,
    pathFile: ''
};

internals.generatePath = (name) => {

    return Path.join(AppRoot.path, internals.config.directory, name + '.' + internals.config.extension);
};

internals.existsFile = (filePath) => {

    return Fs.existsSync(filePath);
};

internals.startRecord = () => {

    Nock.cleanAll();
    Nock.restore();

    internals.recording = true;
    
    Nock.recorder.rec(internals.config.nock);
};

exports.setConfig = (config) => {
    internals.config = Hoek.applyToDefaults(internals.config, config);
};

exports.insert = (name) => {
    
    internals.pathFile = internals.generatePath(name);
    
    if (internals.existsFile(internals.pathFile)) {
        Nock.load(internals.pathFile);
    } else {
        if (! internals.recording) {
            internals.startRecord();
        };
    };
};

exports.eject = (done) => {
    
    if(! internals.existsFile(internals.pathFile)) {
        const calls = Nock.recorder.play();
        const data = JSON.stringify(calls);
        Nock.recorder.clear();

        Fs.writeFile(internals.pathFile, data, (err) => {
            
            if (err) {
                return done(err);
            };

            Nock.cleanAll();
            Nock.enableNetConnect();

            return done(calls);
        });
    } else {
        return done();
    };
};
