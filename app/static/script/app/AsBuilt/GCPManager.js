Ext.ns("AsBuilt");

AsBuilt.GCPManager = function(){

    var gcp = null;

    var gcps = [];

    var lastType = null;

    return Ext.apply(new Ext.util.Observable, {
        handleBeforeGCPAdded: function(tool, geometry) {
            if (tool.type === lastType) {
                 // TODO instruct the user that he should first digitize a point
                 // in the Source Map followed by a corresponding point in the
                 // Reference Map 
                 return false;
            }
        },
        handleGCPAdded: function(tool, geometry) {
            if (tool.type === AsBuilt.plugins.GCP.IMAGE_COORDS) {
                gcp = {source: geometry};
            } else {
                gcp.target = geometry;
                gcps.push(gcp);
            }
            lastType = tool.type;
        },
        getGCPs: function() {
            return gcps;
        }
    })
}();
