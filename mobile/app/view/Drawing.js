Ext.define('AsBuilt.view.Drawing', {
    extend: 'GXM.Map',
    xtype: 'app_drawing',

    config: {
        attributes: null,
        fid: null
    },

    initialize: function() {
        var attributes = this.getAttributes();
        // get the notes
        Ext.getStore('Notes').load({
            filter: new OpenLayers.Filter.Comparison({
                type: '==',
                property: 'DOC_ID',
                value: this.getFid().split(".").pop()
            }), 
            callback: function(records) {
                if (records.length > 0) {
                    Ext.Viewport.add(new Ext.Button({
                        right: 10,
                        bottom: 10,
                        zIndex: 1000,
                        text: records.length + " Notes",
                        title: 'Notes'
                    })); 
                }
            },
            scope: this
        });
        // remove first / and add file extension
        var path = attributes.PATH;
        if (path.charAt(0) === "/") {
            path = path.substring(1);
        }
        path = path + "." + attributes.FILETYPE;
        var width = parseInt(attributes.WIDTH, 10);
        var height = parseInt(attributes.HEIGHT, 10);
        var map = new OpenLayers.Map({
            projection: "EPSG:404000",
            autoUpdateSize: false,
            theme: null,
            hasTransform3D: false,
            maxExtent: new OpenLayers.Bounds(
                0, -height,
                width, 0
            ),
            maxResolution: width/256,
            units: "m",
            controls : [
                new OpenLayers.Control.Zoom(),
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions : {
                        interval : 100,
                        enableKinetic : true
                    }
                })
            ]
        });
        map.addLayers([new OpenLayers.Layer.WMS(null,
            AsBuilt.util.Config.getGeoserverUrl(), {
               layers: AsBuilt.util.Config.getPrefix() + ":" + AsBuilt.util.Config.getImagesLayer(),
               CQL_FILTER: "PATH='"+path+"'"
            }, {
               buffer: 0,
               transitionEffect: "resize",
               tileLoadingDelay: 300
            }
        )]);
        this.setMap(map);
        this.setMapExtent(map.maxExtent);
        Ext.Viewport.add(new Ext.Button({
            right: 10,
            top: 10,
            zIndex: 1000,
            text: "Done"
        }));
        this.callParent(arguments);
    }
});
