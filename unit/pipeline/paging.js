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
        name: "twitter",
        settings: {
            baseURL: "http://search.twitter.com/",
            endpoint: "search.json",
            pageConfig: {
                metadataLocation: "body",
                previousIdentifier: "previous_page",
                nextIdentifier: "next_page",
                parameterProvider: function( body ) {
                    return {
                        previous_page: body.previous_page ? body.previous_page.substr( 1 ) : null,
                        next_page: body.next_page ? body.next_page.substr( 1 ) : null
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

})( jQuery );
