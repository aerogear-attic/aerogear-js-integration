# aerogear-js-integration [![Build Status](https://travis-ci.org/aerogear/aerogear-js.png)](https://travis-ci.org/aerogear/aerogear-js) [![devDependency Status](https://david-dm.org/aerogear/aerogear-js-integration/dev-status.png)](https://david-dm.org/aerogear/aerogear-js-integration#info=devDependencies) #

> Integration tests for AeroGear JavaScript Library

## Running All Tests

    grunt ci-all

## Running Tests Specific for Single Runtime

    grunt ci-vertx
    grunt ci-activemq
    grunt ci-simplepush

## Developing tests

### Start runtime

To start the configured runtime, you do not have to download and configure anything, it will be all done for you:

    grunt daemon:activemq prompt

Then you have two options:

#### Develop right from browser

Open one of the tests under `./tests/` directory in browser. For that you need to start local webserver, e.g. [`httpster`](http://simbco.github.io/httpster/)

    httpster -p 3000

#### Run tests from Karma

Switch `browser` option in `Gruntfile.js` to run in [other browser](http://karma-runner.github.io/0.8/config/browsers.html) than default `PhantomJS`.

Note: you may need to install alternative browser launcher first: `npm install karma-firefox-launcher`
