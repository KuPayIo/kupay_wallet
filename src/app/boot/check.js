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
    var errCallback = function(e) { console.err(e); };

    function processUpdate(localDepend, indexedDBDepend) {
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
            if (currsponding !== sign) {
                unidenticalFiles.push(path);
                remoteCRC[path]=sign;
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
                    ajax.get(serverAddress[0] + "/wallet/" + file, {}, undefined, ajax.RESP_TYPE_BIN, 3000, function (data) {
                        db.write(store, file, data, function() {
                            updatedFiles++;
                            console.log('update process: ', (updatedFiles / unidenticalFilesCount * 100) + '%');
                            // update indexedDB one by one
                            indexedDBDepend[path] = remoteCRC[path];
                            if (updatedFiles === unidenticalFilesCount) {
                                // update complete
                                db.write(store, "", indexedDBDepend, function() {
                                    console.log('write indexdb complete', indexedDBDepend);
                                    unidenticalFiles.forEach(function (e) {
                                        console.log(e, indexedDBDepend[e]);
                                    })
                                    db.delete(store, "$pending", function () {
                                        alert('successfully updated, application will retsart.');
                                    }, errCallback);
                                }, errCallback)
                            }
                        })
                    });
                }
            }, errCallback);
        }
        // is identical
        else {
            console.log('No update to be processed');
        }
    }

    db.init(store, function() {
        var indexedDBDepend = db.read(store, "", function(result, key) {
            var indexedDBDepend = result;
            console.log(result);
            ajax.get(serverAddress[0] + "/wallet/.depend", {}, undefined, undefined, 3000, function (data) {
                //try {
                    data = data.substring(data.indexOf('['), data.lastIndexOf(']')+1);
                    var localDepend = JSON.parse(data);
                    console.log(localDepend);
                    out = localDepend;

                    // Check key-value pair
                    var pendingUpdate;
                    db.read(store, "$pending", function(val) {
                        // If $pending key set, stands for incomplete update
                        if (typeof val !== "undefined") {
                            /// try to get index.js to determine if there's network, timeout is set to 1000ms
                            ajax.get(serverAddress[0] + "/wallet/app/boot/index.js", {}, undefined, undefined, 1000, function() {
                                // continue updating
                                processUpdate(localDepend, indexedDBDepend);
                            }, function(e) {
                                /// TODO:  Application should exit now.
                                alert("A pending update is detected, there's no network avaible, please check your network");
                                throw new Error(e);
                            })
                            return;
                        }
                        // download index.js then compare
                        ajax.get(serverAddress[0] + "/wallet/app/boot/index.js", {}, undefined, undefined, 3000, function(newIndexJS) {
                            console.log('newIndexJS', newIndexJS);
                            // load index.js locally
                            //   first set flag to ensure all assets are loaded from local.
                            localized.setFlag('force-fetch-from-local', function() {
                                //   second get local index.js and compare
                                ajax.get(serverAddress[0] + "/wallet/app/boot/index.js", {}, undefined, undefined, 3000, function(oldIndexJS) {
                                    // index.js changed, ask user to update
                                    if (oldIndexJS === newIndexJS && confirm("Update detected, processed with update?")) {
                                        localized.setForceFetchFromServer(function() {
                                            /// update the 5 files
                                            var updateFiles = [
                                                "app/boot/index.html",
                                                "app/boot/init.js",
                                                "app/boot/next.js",
                                                "app/boot/.depend"
                                            ];
                                            var updateCount = updateFiles.length;
                                            var updatedCount = 0;

                                            for (var file in updateFiles) {
                                                // Save file contents to memory and set pending update state.
                                                localized.update("wallet/" + file, function(result) {
                                                    updatedCount++;
                                                    console.log('update progress: ', (updatedCount / updateCount * 100) + '%');

                                                    // load remote .depend and save to indexed DB
                                                    ajax.get(serverAddress[0] + "/wallet/.depend", function(data) {
                                                        data = data.substring(data.indexOf('['), data.lastIndexOf(']')+1);
                                                        var newestDepend = JSON.parse(data);

                                                        db.write(store, "", newestDepend, function() {
                                                            console.log('write to indexed db success');
                                                            // if update complete, write them to filesystem
                                                            if (updateCount === updatedCount) {
                                                                localized.applyUpdate(function(result) {
                                                                    // all things has done, reload
                                                                    localized.reload(errCallback);
                                                                }, errCallback);
                                                            }
                                                        })
                                                    }, errCallback);


                                                }, errCallback);
                                            }

                                            // update other files
                                            db.write(store, "$pending", "true", function(val) {
                                                if (typeof val === "undefined")
                                                    alert('unknown error');

                                                processUpdate(localDepend, indexedDBDepend);
                                            }, errCallback)

                                            processUpdate(localDepend, indexedDBDepend);

                                        }, errCallback)
                                    }
                                    // no changes, or refused, do nothing and directly enter application
                                    else;
                                }, errCallback)
                            }, function() { console.error('unable to set flag: force-fetch-from-local'); });
                        }, errCallback)
                    }, errCallback);
            }, errCallback);
        }, function (err, key) { alert('Failed to get .depend in database: ' + err); });
    }, errCallback)


};
