Ext.ns("AsBuilt");

AsBuilt.GCPManager = function(){
    return Ext.apply(new Ext.util.Observable, {
        handleBeforeGCPAdded: function(tool, geometry) {
            if (tool.type === this.lastType) {
                 // TODO instruct the user that he should first digitize a point
                 // in the Source Map followed by a corresponding point in the
                 // Reference Map 
                 return false;
            }
        },
        handleGCPAdded: function(tool, geometry) {
            this.lastType = tool.type;
            console.log(tool.type);
            console.log(geometry);
        }

    })
}();
