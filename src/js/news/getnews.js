'use strict';
//全局变量
var objData = {
    arrData: [],         //所有新闻
    arrDataShow: []      //可显示的新闻
};
//获取文件名
var htmlDocName = getHtmlDocName();
//新闻是否加载显示
var newsShowType = '';
var urlJson='';
if (!htmlDocName || htmlDocName == "index") {
    newsShowType = "isshowhome";      //首页展示
    urlJson="./src/html/news/news2018.json";
} else {
    newsShowType = "isshow";          //允许显示
    urlJson="./news2018.json";
}
$.ajax({
    type: "get",
    url: urlJson,
    dataType: "json",
    success: function (re) {
        if (re) {
            var arrData = re;
            objData.arrData = arrData;
            $.each(arrData, function (index, item) {
                if (item["isshow"]) {
                    objData.arrDataShow.push(item);
                }
            });
            if (objData.arrDataShow.length < 10) {
                $("#paginationNext").addClass("disabled");
                $("#paginationEnd").addClass("disabled");
            }
            initNews(objData.arrDataShow.slice(0, 10));
        }
    }, error: function () {
        alert("新闻加载失败，请刷新页面重新加载！");
    },
});

/*分页*/
var start = 0;    //开始索引
var end = 10;     //结束索引
//分页按钮点击事件 
$("#paginationStart").on("click", function () {    //首页
    if (!$(this).hasClass("disabled")) {
        paginationStartDisabled();
        start = 0;
        end = 10;
        initNews(objData.arrDataShow.slice(start, end));
    }
});
$("#paginationPrevious").on("click", function () { //上一页
    if (!$(this).hasClass("disabled")) {
        start = start >= 10 ? start - 10 : 0;
        end = end > 10 ? end - 10 : end;
        //点击后为首页
        if (start == 0) {
            paginationStartDisabled();
        }
        initNews(objData.arrDataShow.slice(start, end));
    }
});
$("#paginationNext").on("click", function () {     //下一页
    if (!$(this).hasClass("disabled")) {
        start = start + 10;
        //点击后为尾页
        if (end + 10 > objData.arrDataShow.length) {
            end = objData.arrDataShow.length;
            paginationEndDisabled();
        } else {
            end = end + 10;
        }
        initNews(objData.arrDataShow.slice(start, end));
    }
});
$("#paginationEnd").on("click", function () {      //尾页
    if (!$(this).hasClass("disabled")) {
        paginationEndDisabled();
        start = Math.floor(objData.arrDataShow / 10) * 10;
        end = objData.arrDataShow.length;
        initNews(objData.arrDataShow.slice(start, end));
    }
});
// 首页 上一页 禁止点击
function paginationStartDisabled() {
    $("#paginationStart").addClass("disabled");
    $("#paginationPrevious").addClass("disabled");
    if ($("#paginationEnd").hasClass("disabled")) {
        $("#paginationNext").removeClass("disabled");
        $("#paginationEnd").removeClass("disabled");
    }
}
// 尾页 下一页 禁止点击
function paginationEndDisabled() {
    $("#paginationNext").addClass("disabled");
    $("#paginationEnd").addClass("disabled");
    if ($("#paginationStart").hasClass("disabled")) {
        $("#paginationStart").removeClass("disabled");
        $("#paginationPrevious").removeClass("disabled");
    }
}
// 初始化载入新闻
function initNews(arrData) {
    $("#newsList").empty();
    var newsid = getUrlParam("newsid");
    $.each(arrData, function (index, item) {
        if (!newsid) {
            var strHtml = '';
            if (newsShowType == "isshowhome" && item[newsShowType]) {//首页展示
                strHtml += '<a href="./src/html/news/newsdetail.html?newsid=' + item["newsid"] + '" target="_blank">' +
                    '<div class="news-list-item">' +
                    '	<h3 class="news-title">' + item["title"] + '</h3>' +
                    '	<p class="news-synopsis">' + item["synopsis"] + '</p>' +
                    '	<p class="news-time">文章来源：<span>' + item["source"] + '</span><span>' + item["time"] + '</span></p>' +
                    '</div>' +
                    '</a>';
                $("#newsList").append(strHtml);
            } else if (newsShowType == "isshow" && item[newsShowType]) {//列表页展示
                strHtml += '<a href="./newsdetail.html?newsid=' + item["newsid"] + '" target="_blank">' +
                    '<div class="news-list-item">' +
                    '	<h3 class="news-title">' + item["title"] + '</h3>' +
                    '	<p class="news-synopsis">' + item["synopsis"] + '</p>' +
                    '	<p class="news-time">文章来源：<span>' + item["source"] + '</span><span>' + item["time"] + '</span></p>' +
                    '</div>' +
                    '</a>';
                $("#newsList").append(strHtml);
            }
        } else {
            if (newsid == item["newsid"]) {
                $("#newsTitle").text(item["title"]);
                $("#newsSource").text(item["source"]);
                $("#newsTime").text(item["time"]);
                var strNewsDetail = '';
                $.each(item["content"], function (i, contentItem) {
                    if (contentItem["type"] == "txt") {
                        strNewsDetail += '<p class="news-synopsis">' + contentItem["section"] + '</p>';
                    }
                    if (contentItem["type"] == "image") {
                        strNewsDetail += '<div class="text_align_center"><img src="' + contentItem["section"] + '" alt="' + (contentItem["name"] || "") + '"></div>';
                    }
                    if (contentItem["type"] == "title") {
                        strNewsDetail += '<div class="news-title border_left_title margin_vertical_10">'+contentItem["section"]+'</div>';
                    }
                    if (contentItem["type"] == "video") {
                        strNewsDetail += '<video src="' + contentItem["section"] + '" controls="controls"></video>'+
                        '<p class="news-text_align_center">' + (contentItem["name"] || "") + '</p>';
                    }
                    if (contentItem["type"] == "audio") {
                        strNewsDetail += '<audio src="' + contentItem["section"] + '" controls="controls"></audio>'+
                        '<p class="news-text_align_center">' + (contentItem["name"] || "") + '</p>';
                    }
                });
                $.each(item["object"], function (i, objectItem) {
                    strNewsDetail += '<p class="news-synopsis text_align_right">' + objectItem + '</p>';
                });
                $("#newsDetail").html(strNewsDetail);
            }
        }
    });
}