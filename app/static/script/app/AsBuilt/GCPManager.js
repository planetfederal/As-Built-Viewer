Ext.ns("AsBuilt");

AsBuilt.GCPManager = function(){
    return Ext.apply(new Ext.util.Observable, {
        handleGCPAdded: function(tool, geometry) {
            console.log(tool.type);
            console.log(geometry);
        }

    })
}();
