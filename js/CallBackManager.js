var CallBackManager = function () {
    this.callbackList = new Array();
}

CallBackManager.prototype.registerCallback = function (callback) {
    var save = true;
    if (this.callbackList.indexOf(callback) != -1) {
        save = false;
    }

    if (save) {
        this.callbackList.unshift(callback);
        return true;
    } else {
        return false;
    }

}

CallBackManager.prototype.unregisterCallback = function (callback) {
    var unregIndex = this.callbackList.indexOf(callback);
    var unreg = false;

    if (unregIndex == -1) {
        unreg = false;
    }

    if (unreg) {
        this.callbackList = this.callbackList.splice(unregIndex, 1);
        return true;
    } else {
        return false;
    }
}

CallBackManager.prototype.call = function (data, extargs = Object()) {
    var tmpdata = data;
    this.callbackList.forEach(function (item, index) {
        if (tmpdata !== false) {
            tmpdata = item(tmpdata, extargs);
        }
    });

    if (tmpdata == undefined) {
        return false;
    } else {
        return tmpdata;
    }
}

