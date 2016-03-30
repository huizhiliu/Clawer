/**
 * Created by liuhuizhi on 16/3/29.
 */
var Q = require("q");

var http = require("http");

var cheerio = require("cheerio");

var url = require("url");

var urls = "http://www.51voa.com/VOA_Standard_1.html";

http.get(urls, function(res) {
    var html = "";
    res.on("data",function(chunk){
        html += chunk;
    });
    res.on("end",function(){
        htmlHandle(html)
    })
});
function htmlHandle(html){
    var $ = cheerio.load(html);
    var urls = $("#list a");
    urls = urls.map(function (index,item) {
        return url.resolve("http://www.51voa.com" ,item.attribs.href);
    });
    urls = Array.prototype.slice.call(urls);
    function fetchUrl(url) {
        var defer = Q.defer();
        http.get(url,function(res){
            var sonHtml = "";
            res.on('data',function(chunk){
                sonHtml += chunk;
            });
            res.on("end",function(){
                logger(sonHtml);
                defer.resolve();
            });
        }).on("error",function(e){
            logger(e);
            defer.reject();
        });
        return defer.promise;
    };
    var lists = [];
    urls.forEach(function(item){
        lists.push(fetchUrl(item));
    });
    Q.all(lists).then(function(results){
        console.log(results)
    });
};
function logger(context){
    console.log.apply(console,[context]);
}