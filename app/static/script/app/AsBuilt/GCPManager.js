Ext.ns("AsBuilt");

AsBuilt.GCPManager = function(){

    var gcp = null;

    var gcps = [];

    var lastType = null;

    return Ext.apply(new Ext.util.Observable, {
        handleBeforeGCPAdded: function(tool, feature) {
            if (lastType !== null && tool.type === lastType) {
                 // TODO instruct the user that he should first digitize a point
                 // in the Source Map followed by a corresponding point in the
                 // Reference Map 
                 return false;
            }
        },
        handleGCPAdded: function(tool, feature) {
            if (tool.type === AsBuilt.plugins.GCP.IMAGE_COORDS) {
                gcp = {source: feature};
            } else {
                gcp.target = feature;
                gcps.push(gcp);
            }
            lastType = tool.type;
        },
        handleGCPRemoved: function(tool, feature) {
            lastType = null;
            for (var i=0, ii=gcps.length; i<ii; ++i) {
                if (gcps[i].source === feature) {
                    // automatically remove the corresponding target
                    var target = gcps[i].target;
                    var layer = target.layer;
                    layer && layer.destroyFeatures([target]);
                }
                if (gcps[i].target === feature) {
                    // automatically remove the corresponding source
                    var source = gcps[i].source;
                    var layer = source.layer;
                    layer && layer.destroyFeatures([source]);
                }
            }
        },
        getGCPs: function() {
            var result = [];
            for (var i=0, ii=gcps.length; i<ii; ++i) {
                var gcp = gcps[i];
                if (gcp.source.geometry !== null && gcp.target.geometry !== null) {
                    result.push(gcp);
                }
            }
            return result;
        }
    })
}();
