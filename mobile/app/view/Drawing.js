Ext.define('AsBuilt.view.Drawing', {
    extend: 'GXM.Map',
    xtype: 'app_drawing',

    config: {
        attributes: null,
        fid: null
    },

    initialize: function() {
        var attributes = this.getAttributes();

        // get the number of notes
        new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            url: AsBuilt.util.Config.getGeoserverUrl(),
            readOptions: {output: "object"},
            resultType: "hits",
            featureType: AsBuilt.util.Config.getNotesTable(),
            featureNS: AsBuilt.util.Config.getFeatureNS()
        }).read({filter: new OpenLayers.Filter.Comparison({
            type: '==',
            property: 'DOC_ID',
            value: this.getFid().split(".").pop()
        }), scope: this, callback: function(resp) {
            if (resp.numberOfFeatures > 0) {
                this.notesBtn = new Ext.Button({
                    right: 10,
                    bottom: 10,
                    zIndex: 1000,
                    text: resp.numberOfFeatures + " Notes",
                    handler: function() {
                    },
                    scope: this
                });
                Ext.Viewport.add(this.notesBtn);
            }
        }});

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
        var btn = new Ext.Button({
            right: 10,
            top: 10,
            zIndex: 1000,
            text: "Done",
            handler: function() {
                Ext.Viewport.remove(btn);
                if (this.notesBtn) {
                    Ext.Viewport.remove(this.notesBtn);
                }
                Ext.Viewport.remove(this);
            },
            scope: this
        });
        Ext.Viewport.add(btn);
        this.callParent(arguments);
    }
});
