
var Q = require("Q");

var fs = require("fs");

function printFile(name) {
    var defer = Q.defer();
    fs.readFile(name,"utf8",function(err,data){
        if(!err && data) {
            //console.log(data);
            defer.resolve();
        }
    })
    return defer.promise;
};


//printFile("index.js")
//    .then(printFile("index_async"))
//    .then(printFile("package.json"))
//    .then(printFile("promise.js"))

Q.all(printFile("index.js"),printFile("index_async.js"),printFile("package.json"),printFile("promise.js")).then(function(results){
    console.log(results.status);
})