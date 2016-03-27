/*
* author:liuhzz
* 2016/03/26
* */

var async = require("async");

var cheerio = require("cheerio");

var http = require("http");

var fs = require("fs");

var Eventproxy =  require("eventproxy");

var url = "http://www.51voa.com/VOA_Standard_1.html";

var currentCount = 0;

http.get(url, function (res) {

    var html = "";

    res.on("data", function (chunk) {
        html += chunk;
    });

    res.on("end", function () {
        htmlHandle(html);
    });
}).on("error", function (e) {

   console.log("错误:" + e.message);

})

function htmlHandle (html) {

    var $ = cheerio.load(html);

    var lists = $("#list a");

    lists = lists.map(function (index,item) {

        return item.attribs.href;
    });

    lists = Array.prototype.slice.call(lists);

    var ep = new Eventproxy();

    ep.after("fetchUrl", lists.length, function () {

    });

    lists.forEach(function (index) {
        http.get(index, function(res){

        }).on("error",function(e){
            console.log("错误:"+e);
        })
    })

    //async.mapLimit(lists, 5, function(list,cb){  //TODO
    //
    //    fetchUrl(list,cb)
    //
    //},function(err,results){
    //    log("finals");
    //    log(results);
    //})
}


function log(){

    console.log.bind(console,arguments);
}

//function fetchUrl(url, callback) {  //TODO
//
//    currentCount++;
//
//    log("现在正在抓去第:"+currentCount+",抓去的url是"+url);
//
//    http.get(url, function (res) {
//        var sonHtml = "";
//
//        res.on("data", function (data) {
//            sonHtml += data;
//        });
//
//        res.on("end", function () {
//            callback(null, sonHtml);
//        })
//    }).on("error", function (e) {
//        console.log("错误是:" + e);
//    })
//
//}





