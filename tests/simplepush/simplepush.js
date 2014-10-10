(function( $ ) {

module( "Connect / Disconnect" );

asyncTest( "Connect to and disconnect from local SimplePush Server and check navigator object", function() {
    expect( 6 );

    var SPClient = AeroGear.SimplePushClient({
        simplePushServerURL: "http://localhost:7777/simplepush",
        onConnect: function() {
            ok( true, "Successfully connected to local SimplePush service" );
            ok( navigator.push, "navigator.push object exists");
            ok( navigator.push.register, "navigator.push.register exists" );
            ok( navigator.push.unregister, "navigator.unregister exists" );
            ok( navigator.setMessageHandler, "navigator.setMessageHandler exists" );
            SPClient.simpleNotifier.disconnect();
        },
        onClose: function() {
            ok( true, "Successfully disconnected from local SimplePush service" );
            localStorage.removeItem("ag-push-store");
            start();
        }
    });
});

module( "Channel Registration" );

asyncTest( "Subscribe to a channel and receive notifications", function() {
    expect( 3 );

    var mailEndpoint,
        ver = 2,
        connection,
        SPClient = AeroGear.SimplePushClient({
            simplePushServerURL: "http://localhost:7777/simplepush",
            onConnect: function() {

                var mailRequest = navigator.push.register();
                mailRequest.onsuccess = function( event ) {
                    ok( true, "Mail endpoint registered" );

                    mailEndpoint = event.target.result;

                    // Delay to make sure message handler is set up
                    $.ajax({
                        url: "http://localhost:8888/tests/simplepush/sender",
                        type: "POST",
                        data: { version: 2, pushEndpoint: mailEndpoint },
                        success: function() {
                            setTimeout(function() {
                                $.ajax({
                                    url: "http://localhost:8888/tests/simplepush/sender",
                                    type: "POST",
                                    data: { version: 3, pushEndpoint: mailEndpoint }
                                });
                            }, 100);
                        }
                    });
                };
                mailRequest.onerror = function( err ) {
                    fail( err );
                    start();
                };

                navigator.setMessageHandler( "push", function( message ) {
                    if ( message.pushEndpoint === mailEndpoint ) {
                        ok( ver === message.version, "Message received" );
                        ver++;
                        if (ver == 4) {
                            SPClient.simpleNotifier.disconnect();
                        }
                    }
                });

                setTimeout(function() {
                    SPClient.simpleNotifier.disconnect();
                }, 5000);
            },
            onClose: function() {
                localStorage.removeItem("ag-push-store");
                start();
            }
        });
});

})( jQuery );
