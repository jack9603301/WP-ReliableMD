Date.prototype.format = function (fmt) {
    var o = {
        "Y+": this.getFullYear(),                    //年
        "M+": this.getMonth() + 1,                 //月份
        "D+": this.getDate(),                    //日
        "H+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "S+": this.getSeconds(),                 //秒
    };
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};