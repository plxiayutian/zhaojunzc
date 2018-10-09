'use strict';
//取页面参数
$.GetPageParameter = function (setting, url) {
    if (!url) url = window.location;
    var tstr = url.search.charAt(url.search.length - 1) != "}" ? url.search + url.hash : url.search;
    var sg = setting || [];
    var re = {};
    var p1 = url.pathname;
    if (tstr) tstr = decodeURIComponent(tstr);
    if (tstr.charAt(0) == "?" && tstr.substr(1).indexOf('=') > 0) {
        var parString = tstr.charAt(0) == "?" ? tstr.substr(1) : "";
        if (parString) {
            var arrp = ( parString ).split('&');
            for (var i = 0; i < arrp.length; i++) {
                var arrp1 = arrp[i].split('=');
                re[arrp1[0]] = arrp1[1] || ""
            }
        }
    } else {
        var parString = tstr.charAt(0) == "?" ? tstr.substr(1) : "{}";
        try {
            eval("re=" + ( parString ))
        } catch (e) {
        }
        ;
        if (!re) re = {}
    }
    for (var i = 0; i < sg.length; i++) {
        var n = {
            name: null,
            defVal: null,
            cookieName: null
        };
        $.extend(n, sg[i]);
        if (!n["name"]) continue;
        re[n["name"]] = re[n["name"]] || n["defVal"]
    }
    if (!re.lang) re.lang = 'zh';
    if (url == window.location) $.PageParam = re;
    return re
};
$(function () {
    $.GetPageParameter([{
        name: "lang",
        defVal: 'zh',
        cookieName: "lang"
    }]);
});
/*
获取当前页面的HTML文件名
*/ 
function getHtmlDocName() {
    var str = window.location.href;
    str = str.substring(str.lastIndexOf("/") + 1);
    str = str.substring(0, str.lastIndexOf("."));
    return str;
}
/*
获取url中的某个参数
ECMAScript v3 已从标准中删除了 unescape() 函数，并反对使用它，因此应该用 decodeURI() 和 decodeURIComponent() 取而代之,编码解码方法:
    escape()　→　unescape()
    encodeURI()　→　 decodeURI()
    encodeURIComponent()　→　decodeURIComponent()
*/ 
function getUrlParam(name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
    //返回参数值
    if (r != null) return unescape(r[2]);
    //不存在时返回null
    return null; 
}
/*
检测手机类型
*/
function ismobile(test) {
    var u = navigator.userAgent, app = navigator.appVersion;
    if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
        if (window.location.href.indexOf("?mobile") < 0) {
            try {
                if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
                    return '0';
                } else {
                    return '1';
                }
            } catch (e) {
            }
        }
    } else if (u.indexOf('iPad') > -1) {
        return '0';
    } else {
        return '1';
    }
};

/*
加载js文档
@file js文档位置
@load 加载后执行
*/
function LoadJs(file, load) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (load) {
        script.onload = script.onreadystatechange = function () {
            if (script.readyState && script.readyState != 'loaded' && script.readyState != 'complete')
                return;
            script.onreadystatechange = script.onload = null;
            load();
        };
    }
    script.src = file;
    document.body.appendChild(script);
}
/*
 功能：表单，下拉选择，选择其它时输入
 */
function selInput(objsel, txtstr) {
    var objElement = $("#" + objsel);
    var txtstring = $("#" + txtstr);
    objElement.change(function () {
        if (objElement.val() == -1) {
            txtstring.show();
            $(this).hide();
        } else {
            txtstring.hide();
            $(this).show();
        }
    });
};