(function( $ ) {

module( "Connect / Disconnect" );

var vertx = AeroGear.Notifier({
    name: "vertx",
    type: "vertx",
    settings: {
        connectURL: "http://vertxbustest-aerogearkb.rhcloud.com:8000/eventbus"
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
    expect( 1 );

    vertx.connect({
        onConnect: function() {
            vertx.subscribe({
                address: "topic.test",
                callback: function( message ) {
                    ok( message === "test message", "Test message received" );
                    vertx.disconnect();
                }
            });

            vertx.send("topic.test", "test message");
        },
        onDisconnect: function() {
            start();
        }
    });
});

})( jQuery );
