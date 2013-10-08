(function( $ ) {

module( "Connect / Disconnect" );

var vertx = AeroGear.Notifier({
    name: "vertx",
    type: "vertx",
    settings: {
        connectURL: "http://localhost:8080/eventbus"
    }
}).clients.vertx;

asyncTest( "Connect to and Disconnect from vert.x Server", function() {
    expect( 2 );

    vertx.connect({
        onConnect: function() {
            ok( true, "Successfully connected to remote vert.x service" );
            vertx.disconnect();
        },
        onDisconnect: function() {
            ok( true, "Successfully disconnected from remote vert.x service" );
            start();
        }
    });
});

module( "Messaging" );

asyncTest( "Subscribe and Send / Recieve Message", function() {
    expect( 2 );

    vertx.connect({
        onConnect: function() {
            vertx.subscribe({
                address: "topic.test",
                callback: function( message ) {
                    if ( message === "test message" ) {
                        ok( true, "Test message received" );
                    }
                    if ( message === "test publish message" ) {
                        ok( true, "Test publish message received" );
                        vertx.disconnect();
                    }
                }
            });

            vertx.send("topic.test", "test message");
            vertx.send("topic.test", "test publish message", true);
        },
        onDisconnect: function() {
            start();
        }
    });
});

})( jQuery );
