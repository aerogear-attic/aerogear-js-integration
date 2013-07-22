(function( $ ) {

module( "Paging" );

var pagingPipes = AeroGear.Pipeline([
    {
        name: "controllerWebLink",
        settings: {
            baseURL: "https://corscontroller-aerogear.rhcloud.com/aerogear-controller-demo/",
            endpoint: "cars",
            pageConfig: true
        }
    },
    {
        name: "controllerHeader",
        settings: {
            baseURL: "https://corscontroller-aerogear.rhcloud.com/aerogear-controller-demo/",
            endpoint: "cars-custom",
            pageConfig: {
                metadataLocation: "header",
                previousIdentifier: "AG-Links-Previous",
                nextIdentifier: "AG-Links-Next"
            }
        }
    },
    {
        name: "github",
        settings: {
            baseURL: "https://api.github.com/",
            endpoint: "orgs/aerogear/repos",
            pageConfig: {
                metadataLocation: "body",
                parameterProvider: function( body ) {
                    var previous = null, next = null,
                        links = body.meta.Link;

                    for ( var link in links ) {
                        if ( links[ link ][ 1 ].rel === "next" ) {
                            next = links[ link ][ 0 ];
                        }
                        if ( links[ link ][ 1 ].rel === "prev" ) {
                            previous = links[ link ][ 0 ];
                        }
                    }
                    return {
                        previous: previous,
                        next: next
                    };
                }
            }
        }
    }
]);

asyncTest( "AeroGear Controller - Web Link", function() {
    expect( 3 );

    pagingPipes.pipes.controllerWebLink.read({
        offsetValue: 2,
        limitValue: 2,
        query: {
            color: "red"
        },
        success: function( data, textStatus, jqXHR ) {
            data.previous({
                success: function( data ) {
                    ok( true, "Read success from previous call" );
                    data.next({
                        success: function() {
                            ok( true, "Read success from next call" );
                            start();
                        }
                    });
                }
            });
            ok( true, "Read success from endpoint with paging" );
        }
    });
});

asyncTest( "AeroGear Controller - Header", function() {
    expect( 3 );

    pagingPipes.pipes.controllerHeader.read({
        offsetValue: 2,
        limitValue: 2,
        query: {
            color: "black"
        },
        success: function( data, textStatus, jqXHR ) {
            data.previous({
                success: function( data ) {
                    ok( true, "Read success from previous call" );
                    data.next({
                        success: function() {
                            ok( true, "Read success from next call" );
                            start();
                        }
                    });
                }
            });
            ok( true, "Read success from endpoint with paging" );
        }
    });
});

asyncTest( "Github - body paging with JSONP", function() {
    expect( 3 );

    pagingPipes.pipes.github.read({
        jsonp: true,
        success: function( data, textStatus, jqXHR ) {
            data.next({
                success: function( data ) {
                    ok( true, "Read success from next call" );
                    data.previous({
                        success: function() {
                            ok( true, "Read success from previous call" );
                            start();
                        }
                    });
                }
            });
            ok( true, "Read success from endpoint with paging using JSONP" );
        }
    });
});

})( jQuery );
