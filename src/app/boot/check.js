//console.log(pi_modules.localize.exports);

// checkjs

var out;
function checkUpdate () {
    var localized = pi_modules.localize.exports;
    var db = pi_modules.store.exports;
    var ajax = pi_modules.ajax.exports;
    var tableName = "wallet";
    var dbName = "wallet";

    var store = db.create(dbName, tableName);
    var errCallback = function(e) { console.error(e); };

    function getVersionNumber(indexJS) {
        /// version number:
        //!version=xx.xx.xx at first line
        var regex = /\/\/ *!version\=([\w\d\.]+)/;
        return indexJS.match(regex)[1];
    }

    function getMainVersionNumber(ver) {
        /// main-ver.sub-ver. ...
        var match = ver.match(/^(\d+).?/);
        if (match == null) {
            throw new Error("A version number must be specified at first line of index.js. Format: `//!version=1.1'");
        }
        return parseInt(match[1]);
    }

    function checkIfLargeUpdate(oldVer, newVer) {
        /// Get main version and compare
        return getMainVersionNumber(oldVer) !== getMainVersionNumber(newVer);
    }

    function processUpdate(localDepend, indexedDBDepend) {
        // localDepend means remoteDepend on first time mobile.remote then
        console.log(indexedDBDepend)
        // Compare the two depend (indexedDB, local)
        var unidenticalFiles = [];
        var remoteCRC = {};
        for (var i=0; i<localDepend.length; ++i) {
            var path = localDepend[i].path;
            var sign = localDepend[i].sign;
            var currsponding = indexedDBDepend[path];

            // explicitly determine if a file is under management of .depend
            if (path.indexOf("app/boot") >= 0)
                continue;
            if (typeof currsponding === "undefined") {
                remoteCRC[path]=sign;
                continue;
            }
            if (currsponding !== sign && currsponding !== '-' + sign && '' + currsponding !== sign) {
                unidenticalFiles.push(path);
                remoteCRC[path]=currsponding;
                console.log('Unidentical file:', path, currsponding, sign);
            }
        }
        console.log(unidenticalFiles);

        var unidenticalFilesCount = unidenticalFiles.length;
        var updatedFiles = 0;

        // if is NOT identical, needs to update
        if (unidenticalFilesCount !== 0) {
            localized.setForceFetchFromServer(function () {
                for (var i in unidenticalFiles) {
                    var file = unidenticalFiles[i];
                    // first download the file
                    ajax.get(serverAddress[0] + "/wallet/" + file + "?"+Math.random(), {}, undefined, ajax.RESP_TYPE_BIN, 10000 + unidenticalFilesCount * 1000, function (data) {
                        db.write(store, file, data, function() {
                            updatedFiles++;
                            console.log('update process: ', (updatedFiles / unidenticalFilesCount * 100) + '%     ');
                            // update indexedDB one by one
                            indexedDBDepend[path] = remoteCRC[path];
                            if (updatedFiles === unidenticalFilesCount) {
                                // update complete
                                db.write(store, "", indexedDBDepend, function() {
                                    console.log('write indexdb complete', indexedDBDepend);
                                    unidenticalFiles.forEach(function (e) {
                                        console.log(e, indexedDBDepend[e]);
                                    })
                                    localStorage.setItem("pending", "false");
                                    //db.write(store, "$pending", "false", function(val) {
                                        localized.setFetchFromLocal(function () {
                                            alert('successfully updated, application will retsart.');
                                            localized.setFlag("close-app", function () { }, function () { alert('Oppps'); });
                                            //localized.reload(errCallback);
                                        }, errCallback);
                                    //}, errCallback);
                                }, errCallback)
                            }
                        })
                    }, function (err) {
                        console.log(err);
                        alert('Cannot update from server, please check your network');
                        localized.setFlag("close-app", function () { }, function () { alert('Oppps'); });
                    });
                }
            }, errCallback);
        }
        // is identical
        else {
            console.log('No update to be processed');
            localStorage.setItem("pending", "false");
            alert('successfully updated, application will retsart.');
            localized.setFlag("restart-app", function () { }, function () { alert('Cannot restart app, please restart manually'); });
        }
    }

    db.init(store, function() {
        var indexedDBDepend = db.read(store, "", function(result, key) {
            var indexedDBDepend = result;

            console.log(result);
            ajax.get(serverAddress[0] + "/wallet/.depend?"+Math.random(), {}, undefined, undefined, 10000, function (data) {
                //try {
                    data = data.substring(data.indexOf('['), data.lastIndexOf(']')+1);
                    var localDepend = JSON.parse(data);
                    // console.log(localDepend);
                    out = localDepend;

                    // Check key-value pair
                    var pendingUpdate;
                    var $pending = localStorage.getItem("pending");
                    //db.read(store, "$pending", function(val) {
                        // If $pending key set, stands for incomplete update
                        if ($pending === "true") {
                            alert('A pending update is held on, update will continue.');
                            /// try to get index.js to determine if there's network, timeout is set to 1000ms
                            ajax.get(serverAddress[0] + "/wallet/app/boot/index.js?"+Math.random(), {}, undefined, undefined, 10000, function() {
                                // continue updating
                                processUpdate(localDepend, indexedDBDepend);
                            }, function(e) {
                                alert("Cannot connect to the server, please check your network");
                                localized.setFlag("close-app", function () { }, function () { alert('Oppps'); });
                                throw new Error(e);
                            })
                            return;
                        }
                        // download index.js then compare
                        ajax.get(serverAddress[0] + "/wallet/app/boot/index.js?"+Math.random(), {}, undefined, undefined, 10000, function(oldIndexJS) {
                            //console.log('[oldIndexJS]', oldIndexJS)
                            var oldIndexJSVersion = getVersionNumber(oldIndexJS);
                            console.log('[oldIndexJS]', oldIndexJSVersion);
                            // load index.js locally
                            //   first set flag to ensure all assets are loaded from local.
                            localized.setForceFetchFromServer(function() {
                                //   second get local index.js and compare
                                ajax.get(serverAddress[0] + "/wallet/app/boot/index.js?"+Math.random(), {}, undefined, undefined, 10000, function(newIndexJS) {

                                    var newIndexJSversion = getVersionNumber(newIndexJS);
                                    console.log('[newIndexJS]', newIndexJSversion);

                                    var forceUpdate = checkIfLargeUpdate(oldIndexJSVersion, newIndexJSversion);
                                    var userAgreeUpdate = false;
                                    if (forceUpdate) {
                                        // to prevent user close application and restart application without network to avoid updates,
                                        // set pending flag before alert.
                                        localStorage.setItem("pending", "false");
                                        alert('A change on main version number is detected, update will start.');
                                    }
                                    else {
                                        userAgreeUpdate = confirm("Update detected, processed with update?");
                                        
                                        // If user disagree with update
                                        if (!userAgreeUpdate) {
                                            localized.setFetchFromLocal(function() {
                                                console.log('current state: force-from-local');
                                            }, function() { console.error('unable to set flag: fetch-from-local'); })
                                        }
                                    }
                                    

                                    // version number changed, ask user to update
                                    if (oldIndexJSVersion !== newIndexJSversion && (forceUpdate || userAgreeUpdate)) {
                                        localized.setForceFetchFromServer(function() {
                                            /// update the 5 files
                                            var updateFiles = [
                                                "app/boot/index.html",
                                                "app/boot/init.js",
                                                "app/boot/next.js",
                                                "app/boot/index.js",
                                                "app/boot/.depend"
                                            ];
                                            var updateCount = updateFiles.length;
                                            var updatedCount = 0;

                                            for (var i in updateFiles) {
                                                var file = updateFiles[i];
                                                // Save file contents to memory and set pending update state.
                                                localized.update("wallet/" + file, function(result) {
                                                    updatedCount++;
                                                    console.log('update progress: ', (updatedCount / updateCount * 100) + '%');

                                                    // if update complete, write them to filesystem
                                                    if (updateCount === updatedCount) {
                                                        localized.applyUpdate(function(result) {
                                                            // all things has done, reload
                                                            // update other files
                                                            localStorage.setItem("pending", "true");
                                                            //db.write(store, "$pending", "true", function(val) {
                                                                // load remote .depend
                                                                ajax.get(serverAddress[0] + "/wallet/.depend?"+Math.random(), {}, undefined, undefined, 10000 + updateCount * 10000,  function(data) {
                                                                    data = data.substring(data.indexOf('['), data.lastIndexOf(']')+1);
                                                                    var remoteDepend = JSON.parse(data);
                                                                    processUpdate(remoteDepend, indexedDBDepend);
                                                                }, errCallback);

                                                            //}, errCallback)

                                                        }, errCallback);
                                                    }

                                                }, errCallback);
                                            }

                                            //processUpdate(localDepend, indexedDBDepend);

                                        }, errCallback)
                                    }
                                    // no changes, or refused, do nothing and directly enter application
                                    else {
                                        localized.setFetchFromLocal(function() {}, errCallback);
                                    }
                                }, function() {
                                    // if get index.js failed, set flag back
                                    localized.setFetchFromLocal(function() {
                                        console.log('current state: force-from-local');
                                    }, function() { console.error('unable to set flag: fetch-from-local'); })
                                })
                            }, function() { console.error('unable to set flag: force-fetch-from-server'); });
                        }, errCallback)
                    //}, errCallback);
            }, errCallback);
        }, function (err, key) { alert('Failed to get .depend in database: ' + err); });
    }, errCallback)


};
