var vertx = require('vertx.js');
var container = require('vertx/container');
var console = require('vertx/console');

var httpServer = vertx.createHttpServer();

var sockJSServer = vertx.createSockJSServer(httpServer);

sockJSServer.bridge({prefix : '/eventbus'}, [{}], [{}] );

httpServer.listen(container.config.port, container.config.host);

console.log('Vertx started');
