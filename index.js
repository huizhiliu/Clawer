/*
* author:liuhzz
*
* 2016/03/26
*
 */

var cheerio = require("cheerio");

var http = require("http");

var fs = require("fs");

var Eventproxy =  require("eventproxy");

var url = require("url");

var urls = "http://www.51voa.com/VOA_Standard_1.html";

http.get(urls, function (res) {
    var html = "";
    res.on("data", function (chunk) {
        html += chunk;
    });
    res.on("end", function () {
        htmlHandle(html);
    });
}).on("error", function (e) {
   logger("错误:" + e.message);
});

function htmlHandle (html) {
    var $ = cheerio.load(html);
    var lists = $("#list a");
    lists = lists.map(function (index,item) {
        return url.resolve("http://www.51voa.com" ,item.attribs.href);
    });
    lists = Array.prototype.slice.call(lists);
    logger(lists[1]);
    var ep = new Eventproxy();      //跳出回调深坑
    ep.after("fetchUrl", lists.length, function (results) {  //注册事件
        results.forEach(function (item,index) {
            logger("目前正在抓取第" + index + "条, url是" + item[0]);
            var $ = cheerio.load(item[1]);
            var mp3Url = $("#mp3").attr("href");
            http.get(mp3Url, function (res) {
                initDir((index).toString());
                res.on("data", function () {
                    var writeStream = fs.createWriteStream((index).toString()+"/"+ index,{flags:'w'});
                   res.pipe(writeStream);
                });
            }).on("error", function (e) {
                logger("错误:" + e);
            })
        });
    });

    lists.forEach(function (index) {
        http.get(index, function(res){
            var  sonHtml = "";
            res.on("data", function (data) {
                sonHtml += data;
            });
            res.on("end", function () {
                ep.emit("fetchUrl", [index,sonHtml]); //发射
            })
        }).on("error",function(e){
           logger("错误:"+e);
        })
    });
}


function initDir(name){
    try{
        fs.readdirSync(name);
    }catch(e){
        if(e.errno === -2)
            fs.mkdirSync(name);
    }
}

function logger(context){
    console.log.apply(console,[context]);
}







