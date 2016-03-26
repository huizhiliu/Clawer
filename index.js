
var async = require("async");

var cheerio = require("cheerio");

var http = require("http");

var url = "http://www.51voa.com/VOA_Standard_1.html";



http.get(url, function (res) {

    var html = "";

    res.on("data", function (chunk) {
        html += chunk;
    });

    res.on("end", function () {
        var $ = cheerio.load(html);
        console.log(html);
    });
}).on("error", function (e) {

   console.log("错误:" + e.message);
})
