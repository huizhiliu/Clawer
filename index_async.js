/**
 * Created by liuhuizhi on 16/3/28.
 */
var async = require("async");
var cheerio = require("cheerio");
var fs = require("fs");
var http = require("http");
var url = require("url");

var urls = "http://www.51voa.com/VOA_Standard_1.html";

http.get(urls, function (res) {
    var html = "";
    res.on("data",function(chunk){
        html += chunk;
    });
    res.on("end", function () {
        htmlHandle(html);
    });
}).on("error",function (e){
    logger("错误:" + e);
});

function logger(context){
    console.log.apply(console,[context]);
}

function htmlHandle(html) {
    var $ = cheerio.load(html);
    var lists = $("#list a");
    lists = lists.map(function (index,item) {
        return url.resolve("http://www.51voa.com" ,item.attribs.href);
    });
    lists = Array.prototype.slice.call(lists);

    var fetchUrl = function (url, callback) {
        http.get(url,function(res) {
            var sonHtml = "";
            res.on("data", function(){
                sonHtml += res;
            });
            res.on("end",function(){
                callback(null,html);
            });
        }).on("error", function(e) {
            logger("错误是:" + e);
        })
    };
    async.mapLimit(lists, 5, function(url,callback) {
        fetchUrl(url,callback);
    }, function(err,result){
        logger(result);
    });
}


