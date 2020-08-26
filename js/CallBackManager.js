var CallBackManager = function (key) {
    var instance = {};
    var instances = CallBackManager.instance;
    instance.callbackList = new Array();
    instance.registerCallback = function (callback) {
        var save = true;
        if (this.callbackList.indexOf(callback) != -1) {
            save = false;
        }

        if (save) {
            this.callbackList.push(callback);
            return true;
        } else {
            return false;
        }

    }

    instance.unregisterCallback = function (callback) {
        var unregIndex = this.callbackList.indexOf(callback);
        var unreg = true;

        if (unregIndex == -1) {
            unreg = false;
        }

        if (unreg) {
            this.callbackList.splice(unregIndex, 1);
            return true;
        } else {
            return false;
        }
    }

    instance.call = function (data, extargs = new Object()) {
        var tmpdata = data;
        this.callbackList.forEach(function (item, index) {
            if (tmpdata !== false) {
                tmpdata = item(tmpdata, extargs);
            }
        });

        if (typeof tmpdata !== "object") {
            return false;
        } else {
            return tmpdata;
        }
    }

    if (typeof key == "string") {
        if (key in instances) {
            return instances[key];
        } else {
            instances[key] = instance;
            return instances[key];
        }
    } else {
        console.error("The callback manager instance gets the key parameter illegally. Failure to get the instance may cause the dependent components to fail to work properly!")
        return false;
    }
}

CallBackManager.instance = new Object();