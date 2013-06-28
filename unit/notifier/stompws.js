(function( $ ) {

module( "Connect / Disconnect" );

var stomp = AeroGear.Notifier({
    name: "stomp",
    type: "stompws",
    settings: {
        connectURL: "ws://activemq-aerogearkb.rhcloud.com:8000/stomp"
    }
}).clients.stomp;

asyncTest( "Connect to and Disconnect from STOMP Server", function() {
    expect( 2 );

    stomp.connect({
        onConnect: function() {
            ok( true, "Successfully connected to remote STOMP service over websocket" );
            stomp.disconnect( function() {
                ok( true, "Successfully disconnected from remote STOMP service over websocket" );
                start();
            });
        }
    });
});

module( "Messaging" );

asyncTest( "Subscribe and Send / Recieve Message", function() {
    expect( 1 );

    stomp.connect({
        onConnect: function() {
            stomp.subscribe({
                address: "/topic/test",
                callback: function( message ) {
                    ok( message.body === "test message", "Test message received" );
                    stomp.disconnect( function() {
                        start();
                    });
                }
            });

            stomp.send("/topic/test", "test message");
        }
    });
});

})( jQuery );
