/**
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function ($) {

    var REST_WS_CONTEXT_PATH = "/aerogear-rest-service/rest/memberservice/",
        BASE_URL = ["https://localhost:8443", REST_WS_CONTEXT_PATH].join("");
    
    // create utility lib
    var UtilLib =
    {
        memberExists: function (id, listOrMember)
        {
            if (listOrMember && listOrMember instanceof Array && id)
            {
                for (var i=0; i<listOrMember.length; i++)
                {
                    if (listOrMember[i] && listOrMember[i].id === id)
                    {
                        return true;
                    }
                }
            }
            else if (id && listOrMember && listOrMember.id === id)
            {
                return true;
            }
            return false;
        }
    };
    
    // define pipelines and pipes
    var pipeline = AeroGear.Pipeline([
            {
                name: "saveMember",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "add"
                }
            },
            {
                name: "updateMember",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "update"
                }
            },
            {
                name: "readMembers",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "members"
                }
            },
            {
                name: "readMembersJSONP",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "membersjsonp"
                }
            },
            {
                name: "removeMember",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "remove"
                }
            },
            {
                name: "readMember",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "member"
                }
            },
            {
                name: "readMemberCustom",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "member",
                    recordId: "customId"
                }
            },
            {
                name: "memberPages",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages",
                    pageConfig: true
                }
            },
            {
                name: "memberPagesCustomIds",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpagescustom",
                    pageConfig: {
                        previousIdentifier: "previous_page",
                        nextIdentifier: "next_page"
                    }
                }
            },
            {
                name: "memberPagesCustomQueryParams",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpagescustomparams",
                    pageConfig: true
                }
            },
            {
                name: "memberPagesCustomIdsAndParams",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpagescustomidsandparams",
                    pageConfig: {
                        previousIdentifier: "previous_page",
                        nextIdentifier: "next_page"
                    }
                }
            },
            {
                name: "memberPagesHeader",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages/headertest",
                    pageConfig: {
                        metadataLocation: "header"
                    }
                }
            },
            {
                name: "memberPagesHeaderCustomIds",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages/headertestcustomids",
                    pageConfig: {
                        metadataLocation: "header",
                        previousIdentifier: "previous_page",
                        nextIdentifier: "next_page"
                    }
                }
            },
            {
                name: "memberPagesHeaderCustomQueryParams",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages/headertestcustomparams",
                    pageConfig: {
                        metadataLocation: "header"
                    }
                }
            },
            {
                name: "memberPagesHeaderCustomIdsAndQueryParams",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages/headertestcustomidsandparams",
                    pageConfig: {
                        metadataLocation: "header",
                        previousIdentifier: "previous_page",
                        nextIdentifier: "next_page"
                    }
                }
            },
            {
                name: "memberPagesHeaderCustomIdsQueryParamsAndParamProvider",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages/headertestcustomidsparamsandparamprovider",
                    pageConfig: {
                        metadataLocation: "header",
                        previousIdentifier: "previous_page",
                        nextIdentifier: "next_page",
                        parameterProvider: function (jqXHR) {
                            var links = {};
                            links.next_page = JSON.parse(jqXHR.getResponseHeader("previous_page"));
                            links.previous_page = JSON.parse(jqXHR.getResponseHeader("next_page"));
                            return links;
                        }
                    }
                }
            },
            {
                name: "bodyTest",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages/bodytest",
                    pageConfig: {
                        metadataLocation: "body"
                    }
                }
            },
            {
                name: "bodyTestCustomIds",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages/bodytestcustomids",
                    pageConfig: {
                        metadataLocation: "body",
                        previousIdentifier: "previous_page",
                        nextIdentifier: "next_page"
                    }
                }
            },
            {
                name: "bodyTestCustomQueryParams",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages/bodytestcustomqueryparams",
                    pageConfig: {
                        metadataLocation: "body"
                    }
                }
            },
            {
                name: "bodyTestCustomIdsAndParams",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages/bodytestcustomidsandparams",
                    pageConfig: {
                        metadataLocation: "body",
                        previousIdentifier: "previous_page",
                        nextIdentifier: "next_page"
                    }
                }
            },
            {
                name: "memberPagesBodyCustomIdsQueryParamsAndParamProvider",
                settings: {
                    baseURL: BASE_URL,
                    endpoint: "memberpages/bodytestcustomidsparamsandparamprovider",
                    pageConfig: {
                        metadataLocation: "header",
                        previousIdentifier: "previous_page",
                        nextIdentifier: "next_page",
                        parameterProvider: function (body) {
                            var links = {};
                            links.next_page = JSON.parse(body.responseText).next_page;
                            links.previous_page = JSON.parse(body.responseText).previous_page;
                            return links;
                        }
                    }
                }
            }
        ]),
        saveMemberPipe = pipeline.pipes.saveMember,
        updateMemberPipe = pipeline.pipes.updateMember,
        readMembersPipe = pipeline.pipes.readMembers,
        readMembersJsonpPipe = pipeline.pipes.readMembersJSONP,
        readMemberPipe = pipeline.pipes.readMember,
        readMemberCustomPipe = pipeline.pipes.readMemberCustom,
        removeMemberPipe = pipeline.pipes.removeMember,
        memberPagesPipe = pipeline.pipes.memberPages,
        memberPagesCustomIdsPipe = pipeline.pipes.memberPagesCustomIds,
        memberPagesCustomParams = pipeline.pipes.memberPagesCustomQueryParams,
        memberPagesCustomIdsAndParams = pipeline.pipes.memberPagesCustomIdsAndParams,
        memberPagesHeader = pipeline.pipes.memberPagesHeader,
        memberPagesHeaderCustomIds = pipeline.pipes.memberPagesHeaderCustomIds,
        memberPagesHeaderCustomQueryParams = pipeline.pipes.memberPagesHeaderCustomQueryParams,
        memberPagesHeaderCustomIdsAndQueryParams = pipeline.pipes.memberPagesHeaderCustomIdsAndQueryParams,
        memberPagesHeaderCustomIdsQueryParamsAndParamProvider = pipeline.pipes.memberPagesHeaderCustomIdsQueryParamsAndParamProvider,
        memberPagesBodyTest = pipeline.pipes.bodyTest,
        memberPagesBodyTestCustomIds = pipeline.pipes.bodyTestCustomIds,
        memberPagesBodyTestCustomQueryParams = pipeline.pipes.bodyTestCustomQueryParams,
        memberPagesBodyTestCustomIdsAndParams = pipeline.pipes.bodyTestCustomIdsAndParams,
        memberPagesBodyTestCustomIdsParamsAndParamProvider = pipeline.pipes.memberPagesBodyCustomIdsQueryParamsAndParamProvider;
   
    module("Pipeline: Rest: CORS: CRUD");
    
    // save method test
    asyncTest("save method", function () {
        expect(3);
        
        var save = saveMemberPipe.save({
                description: "description_1"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    strictEqual(data.description, 'description_1', "Callback data description on save");
                }
        });

        $.when(save).done(function (s1) {
            start();
        });
    });
    
    // update method test
    asyncTest("update method", function () {
        expect(6);
        
        var save,
            update,
            member_id = null;
        
        save = saveMemberPipe.save({
                description: "description_2"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    member_id = data.id;
                    strictEqual(data.description, 'description_2', "Callback data description on save");
                }
        });

        $.when(save).done(function (s1) {
            
            update = updateMemberPipe.save({
                    id: member_id,
                    description: "description_3"
                }, {
                    success: function (data, textStatus, jqXHR) {
                        ok(true, "PUT - update data");
                        notStrictEqual(data.id, '', "Callback data id on save");
                        strictEqual(data.description, 'description_3', "Callback data description on update");
                    }
            });
            
            $.when(update).done(function (s2) {
                start();
            });
        
        });
    });
    
    // read method test
    asyncTest("read method", function () {
        expect(5);
        
        var save,
            read,
            member_id = null;
        
        save = saveMemberPipe.save({
                description: "description_4"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    member_id = data.id;
                    strictEqual(data.description, 'description_4', "Callback data description on save");
                }
        });

        $.when(save).done(function (s1) {
            
            read = readMembersPipe.read({
                    success: function (data, textStatus, jqXHR) {
                        ok(true, "GET - read data");
                        ok(UtilLib.memberExists(member_id, data), "Saved member is returned on read");
                    }
            });
            
            $.when(read).done(function (s2) {
                start();
            });
        
        });
    });
   
    // remove method test
    asyncTest("remove method", function () {
        expect(6);
        
        var save,
            remove,
            read,
            member_id = null;
        
        save = saveMemberPipe.save({
                description: "description_5"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    member_id = data.id;
                    strictEqual(data.description, 'description_5', "Callback data description on save");
                }
        });

        $.when(save).done(function (s1) {
            
            remove = removeMemberPipe.remove(member_id, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "DELETE - remove data");
                }
            });
            
            $.when(remove).done(function (s2) {
                
                read = readMembersPipe.read({
                    success: function (data, textStatus, jqXHR) {
                        ok(true, "GET - read data");
                        ok(!UtilLib.memberExists(member_id, data), "Deleted member is not returned on read");
                    }
                });
                
                $.when(read).done(function (s3) {
                    start();
                });
                
            });
        
        });
    });
   
    // read with limit filter method test
    asyncTest("read method with limit filter", function () {
        expect(8);
        
        var save,
            save_2,
            read;
        
        save = saveMemberPipe.save({
                description: "description_6"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    strictEqual(data.description, 'description_6', "Callback data description on save");
                }
        });
        
        save_2 = saveMemberPipe.save({
                description: "description_7"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    strictEqual(data.description, 'description_7', "Callback data description on save");
                }
        });

        $.when(save, save_2).done(function (s1, s2) {
            
            read = readMembersPipe.read({
                    query: {
                        limit: 1
                }, success: function (data, textStatus, jqXHR) {
                    ok(true, "GET - read data");
                    strictEqual(data.length, 1, "Read with filter limit");
                }
            });
            
            $.when(read).done(function (s3) {
                start();
            });
        
        });
    });
    
    // read with limit & identifier method test
    asyncTest("read method with limit and identifier", function () {
        expect(9);
        
        var save,
            save_2,
            read,
            member_id = null;
        
        save = saveMemberPipe.save({
                description: "description_7"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    member_id = data.id;
                    notStrictEqual(data.id, '', "Callback data id on save");
                    strictEqual(data.description, 'description_7', "Callback data description on save");
                }
        });
        
        save_2 = saveMemberPipe.save({
                description: "description_8"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    strictEqual(data.description, 'description_8', "Callback data description on save");
                }
        });

        $.when(save, save_2).done(function (s1, s2) {
            
            read = readMemberPipe.read({
                    query: {
                        limit: 1
                },
                id: member_id,
                success: function (data, textStatus, jqXHR) {
                    ok(true, "GET - read data");
                    strictEqual(data.length, 1, "Read with filter limit & where");
                    ok(UtilLib.memberExists(member_id, data), "Correct member is retrieved afetr setting limit and where filters");
                }
            });
            
            $.when(read).done(function (s3) {
                start();
            });
        
        });
    });
    
    // read with limit & custom identifier method test
    asyncTest("read method with limit and custom identifier", function () {
        expect(9);
        
        var save,
            save_2,
            read,
            member_id = null;
        
        save = saveMemberPipe.save({
                description: "description_9"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    member_id = data.id;
                    notStrictEqual(data.id, '', "Callback data id on save");
                    strictEqual(data.description, 'description_9', "Callback data description on save");
                }
        });
        
        save_2 = saveMemberPipe.save({
                description: "description_10"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    strictEqual(data.description, 'description_10', "Callback data description on save");
                }
        });

        $.when(save, save_2).done(function (s1, s2) {
            
            read = readMemberCustomPipe.read({
                    query: {
                        limit: 1
                },
                customId: member_id,
                success: function (data, textStatus, jqXHR) {
                    ok(true, "GET - read data");
                    strictEqual(data.length, 1, "Read with filter limit & where");
                    ok(UtilLib.memberExists(member_id, data), "Correct member is retrieved after setting limit and id filter");
                }
            });
            
            $.when(read).done(function (s3) {
                start();
            });
        
        });
    });
    
    // read with limit & custom identifier method test
    asyncTest("read method with limit and custom identifier", function () {
        expect(13);
        
        var save,
            save_2,
            save_3,
            read;
        
        save = saveMemberPipe.save({
                description: "description_11"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    strictEqual(data.description, 'description_11', "Callback data description on save");
                }
        });
        
        save_2 = saveMemberPipe.save({
                description: "description_11"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    strictEqual(data.description, 'description_11', "Callback data description on save");
                }
        });
        
        save_3 = saveMemberPipe.save({
                description: "description_11"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    strictEqual(data.description, 'description_11', "Callback data description on save");
                }
        });

        $.when(save, save_2, save_3).done(function (s1, s2, s3) {
            
            read = readMembersPipe.read({
                query: {
                    limit: 2,
                    description: "description_11"
                }, success: function (data, textStatus, jqXHR) {
                    ok(true, "GET - read data");
                    strictEqual(data.length, 2, "Read with filter limit & where");
                    strictEqual(data[0].description, "description_11", "Correct members are retrieved on query filter");
                    strictEqual(data[1].description, "description_11", "Correct members are retrieved on query filter");
                }
            });
            
            $.when(read).done(function (s4) {
                start();
            });
        
        });
    });

    module("Pipeline: Rest: CORS: Paging");
    
    asyncTest("webLinking", function () {
        expect(3);

        memberPagesPipe.read({
            offsetValue: 1,
            limitValue: 2,
            success: function (data, textStatus, jqXHR) {
                data.previous({
                    success: function (data) {
                        ok(true, "Read success from previous call");
                        data.next({
                            success: function () {
                                ok(true, "Read success from next call");
                                start();
                            }
                        });
                    }
                });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });
    
    asyncTest("webLinking with custom ids", function () {
        expect(3);

        memberPagesCustomIdsPipe.read({
            offsetValue: 1,
            limitValue: 2,
            success: function (data, textStatus, jqXHR) {
                data.previous({
                    success: function (data) {
                        ok(true, "Read success from previous call");
                        data.next({
                            success: function () {
                                ok(true, "Read success from next call");
                                start();
                            }
                        });
                    }
                });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });
    
    asyncTest("webLinking with custom query parameters", function () {
        expect(3);

        memberPagesCustomParams.read({
            paging: {
                pageNumber: 1,
                objectLimit: 2
            },
            success: function (data, textStatus, jqXHR) {
                data.previous({
                    success: function (data) {
                        ok(true, "Read success from previous call");
                        data.next({
                            success: function () {
                                ok(true, "Read success from next call");
                                start();
                            }
                        });
                    }
                });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });
    
    asyncTest("webLinking with custom identifiers and query parameters", function () {
        expect(3);

        memberPagesCustomIdsAndParams.read({
            paging: {
                pageNumber: 2,
                objectLimit: 2
            },
            success: function (data, textStatus, jqXHR) {
                data.previous({
                        success: function (data) {
                            ok(true, "Read success from previous call");
                            data.next({
                                success: function () {
                                    ok(true, "Read success from next call");
                                    start();
                                }
                            });
                        }
                    });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });
    
    asyncTest("header", function () {
        expect(3);

        memberPagesHeader.read({
            offset: 1,
            limit: 2,
            success: function (data, textStatus, jqXHR) {
                data.previous({
                        success: function (data) {
                            ok(true, "Read success from previous call");
                            data.next({
                                success: function () {
                                    ok(true, "Read success from next call");
                                    start();
                                }
                            });
                        }
                    });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });
    
    asyncTest("header and custom identifiers", function () {
        expect(3);

        memberPagesHeaderCustomIds.read({
            offsetValue: 1,
            limitValue: 2,
            success: function (data, textStatus, jqXHR) {
                data.previous({
                        success: function (data) {
                            ok(true, "Read success from previous call");
                            data.next({
                                success: function () {
                                    ok(true, "Read success from next call");
                                    start();
                                }
                            });
                        }
                    });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });
    
    asyncTest("header custom query parameters", function () {
        expect(3);

        memberPagesHeaderCustomQueryParams.read({
            paging: {
                pageNumber: 2,
                objectLimit: 2
            },
            success: function (data, textStatus, jqXHR) {
                data.previous({
                        success: function (data) {
                            ok(true, "Read success from previous call");
                            data.next({
                                success: function () {
                                    ok(true, "Read success from next call");
                                    start();
                                }
                            });
                        }
                    });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });
    
    asyncTest("header custom identifiers and query parameters", function () {
        expect(3);

        memberPagesHeaderCustomIdsAndQueryParams.read({
            paging: {
                pageNumber: 2,
                objectLimit: 2
            },
            success: function (data, textStatus, jqXHR) {
                data.previous({
                        success: function (data) {
                            ok(true, "Read success from previous call");
                            data.next({
                                success: function () {
                                    ok(true, "Read success from next call");
                                    start();
                                }
                            });
                        }
                    });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });
    
    asyncTest("header custom identifiers and query parameters with parameter provider", function () {
        expect(3);

        memberPagesHeaderCustomIdsQueryParamsAndParamProvider.read({
            paging: {
                pageNumber: 2,
                objectLimit: 2
            },
            success: function (data, textStatus, jqXHR) {
                data.previous({
                        success: function (data) {
                            ok(true, "Read success from previous call");
                            data.next({
                                success: function () {
                                    ok(true, "Read success from next call");
                                    start();
                                }
                            });
                        }
                    });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });
    
    asyncTest("body", function () {
        expect(3);

        memberPagesBodyTest.read({
            offsetValue: 1,
            limitValue: 2,
            success: function (data, textStatus, jqXHR) {
                data.previous({
                    success: function (data) {
                        ok(true, "Read success from previous call");
                        data.next({
                            success: function () {
                                ok(true, "Read success from next call");
                                start();
                            }
                        });
                    }
                });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });

    asyncTest("body custom identifiers", function () {
        expect(3);

        memberPagesBodyTestCustomIds.read({
            offsetValue: 1,
            limitValue: 2,
            success: function (data, textStatus, jqXHR) {
                data.previous({
                    success: function (data) {
                        ok(true, "Read success from previous call");
                        data.next({
                            success: function () {
                                ok(true, "Read success from next call");
                                start();
                            }
                        });
                    }
                });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });

    asyncTest("body custom query parameters", function () {
        expect(3);

        memberPagesBodyTestCustomQueryParams.read({
            paging: {
                pageNumber: 1,
                objectLimit: 2
            },
            success: function (data, textStatus, jqXHR) {
                data.previous({
                        success: function (data) {
                            ok(true, "Read success from previous call");
                            data.next({
                                success: function () {
                                    ok(true, "Read success from next call");
                                    start();
                                }
                            });
                        }
                    });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });

    asyncTest("body custom identifiers and query parameters", function () {
        expect(3);

        memberPagesBodyTestCustomIdsAndParams.read({
            paging: {
                pageNumber: 1,
                objectLimit: 2
            },
            success: function (data, textStatus, jqXHR) {
                data.previous({
                        success: function (data) {
                            ok(true, "Read success from previous call");
                            data.next({
                                success: function () {
                                    ok(true, "Read success from next call");
                                    start();
                                }
                            });
                        }
                    });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });

    asyncTest("body custom identifiers and query parameters with parameter provider", function () {
        expect(3);

        memberPagesBodyTestCustomIdsParamsAndParamProvider.read({
            paging: {
                pageNumber: 1,
                objectLimit: 2
            },
            success: function (data, textStatus, jqXHR) {
                data.previous({
                        success: function (data) {
                            ok(true, "Read success from previous call");
                            data.next({
                                success: function () {
                                    ok(true, "Read success from next call");
                                    start();
                                }
                            });
                        }
                    });
                ok(true, "Read success from endpoint with paging");
            }
        });
    });
    
    module("Pipeline: Rest: JSONP:");
    
    // read method test
    asyncTest("read method", function () {
        expect(4);
        
        var save,
            read;
        
        save = saveMemberPipe.save({
                description: "description_4"
            }, {
                success: function (data, textStatus, jqXHR) {
                    ok(true, "POST - new data");
                    notStrictEqual(data.id, '', "Callback data id on save");
                    //member_id = data.id;
                    strictEqual(data.description, 'description_4', "Callback data description on save");
                }
        });

        $.when(save).done(function (s1) {
            
            read = readMembersJsonpPipe.read({
                    success: function (data, textStatus, jqXHR) {
                        ok(true, "GET - read data");
                        //ok(UtilLib.memberExists(member_id, data), "Saved member is returned on read");
                    },
                    jsonp: {
                        callback: "jsonpcallback"
                    }
            });
            
            $.when(read).done(function (s2) {
                start();
            });
        
        });
    });

})(jQuery);
