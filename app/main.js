var {Application} = require("stick");

var app = Application();
app.configure("notfound", "error", "static", "params", "mount");
app.static(module.resolve("static"));

app.mount("/", function(request) {
    if (request.pathInfo.length > 1) {
        throw {notfound: true};
    }
    var target = request.scheme + "://" + request.host + ":" + request.port + request.scriptName + "/image-browser/";
    return {
        status: 303,
        headers: {"Location": target},
        body: []
    };
});
app.mount("/image-browser", require("./root/image-browser").app);
app.mount("/image-tagger", require("./root/image-tagger").app);
app.mount("/image-rectifier", require("./root/image-rectifier").app);
app.mount("/proxy", require("./root/proxy").app);

// debug mode loads unminified scripts
// assumes markup pulls in scripts under the path /servlet_name/script/
if (java.lang.System.getProperty("app.debug")) {
    var fs = require("fs");
    var config = fs.normal(fs.join(module.directory, "..", "buildjs.cfg"));
    app.mount("/script/", require("./autoloader").App(config));

    // proxy a remote geoserver on /geoserver by setting app.proxy.geoserver to remote URL
    // only recommended for debug mode
    var geoserver = java.lang.System.getProperty("app.proxy.geoserver");
    if (geoserver) {
        if (geoserver.charAt(geoserver.length-1) !== "/") {
            geoserver = geoserver + "/";
        }
        // debug specific proxy
        app.mount("/geoserver/", require("./root/proxy").pass({url: geoserver, preserveHost: true, allowAuth: true}));
    }
}

exports.app = app;

// main script to start application
if (require.main === module) {
    require("ringo/httpserver").main(module.id);
}
