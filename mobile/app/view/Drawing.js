Ext.define('AsBuilt.view.Drawing', {
    extend: 'Ext.Container',
    requires: ['GXM.Button', 'AsBuilt.util.Config', 'GXM.Map', 'Ext.SegmentedButton'],
    xtype: 'app_drawing',

    config: {
        attributes: null,
        fid: null,
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            height: 50,
            items: [{
                xtype: 'segmentedbutton',
                defaults: {
                    ui: 'drawing'
                },
                items: [{
                    text: AsBuilt.util.Config.getDetailsButtonText(),
                    type: 'details'
                }, {
                    text: AsBuilt.util.Config.getNotesButtonText(),
                    type: "notes_button"
                }]
            }, {
                xtype: 'spacer',
                flex: 1
            }, {
                text: AsBuilt.util.Config.getDoneButtonText(),
                type: "drawing_done"
            }]
        }]
    },

    initialize: function() {
        var attributes = this.getAttributes();
        // get the notes
        Ext.getStore('Notes').on({'load': function(store, records) {
            var item = this.down('segmentedbutton').getItems().items[1],
                title = AsBuilt.util.Config.getNotesItemTitle();
            if (records.length > 0) {
                item.setText(
                    records.length + " " + AsBuilt.util.Config.getNotesTextSuffix()
                );
                item.title = title;
                AsBuilt.app.getController('Notes').showNotes();
            } else { 
                item.setText(
                    AsBuilt.util.Config.getAddNoteButtonText()
                );
                item.title = title;
            } 
        }, scope: this});
        Ext.getStore('Notes').load({
            filter: new OpenLayers.Filter.Comparison({
                type: '==',
                property: AsBuilt.util.Config.getDocumentIdField(),
                value: this.getFid().split(".").pop()
            })
        });
        // remove first / and add file extension
        var path = attributes[AsBuilt.util.Config.getPathField()];
        if (path.charAt(0) === "/") {
            path = path.substring(1);
        }
        path = path + "." + attributes[AsBuilt.util.Config.getFileTypeField()];
        var width = parseInt(attributes[AsBuilt.util.Config.getImageWidthField()], 10);
        var height = parseInt(attributes[AsBuilt.util.Config.getImageHeightField()], 10);
        var vector = new OpenLayers.Layer.Vector(null, {
            styleMap: new OpenLayers.StyleMap({
                temporary : OpenLayers.Util.applyDefaults({
                    pointRadius : 16
                }, OpenLayers.Feature.Vector.style.temporary)
            })
        });
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
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions : {
                        interval : 100,
                        enableKinetic : true
                    }
                }),
                new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Path),
                new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.RegularPolygon, {handlerOptions: {sides: 40}})
            ]
        });
        map.addLayers([new OpenLayers.Layer.WMS(null,
            AsBuilt.util.Config.getGeoserverUrl(), {
               layers: AsBuilt.util.Config.getPrefix() + ":" + AsBuilt.util.Config.getImagesLayer(),
               CQL_FILTER: AsBuilt.util.Config.getPathField() + "='" + path + "'"
            }, {
               buffer: 0,
               transitionEffect: "resize",
               tileLoadingDelay: 300
            }
        ), vector]);
        var mapZoom = 3;
        var res = map.getResolutionForZoom(mapZoom);
        var size = Ext.Viewport.getSize(), w = size.width, h = size.height;
        var factorX = (1 - ((res*w)/width/2));
        var factorY = (1 - ((res*h)/height/2));
        var center = [factorX*width, -factorY*height];
        this.add(Ext.create('GXM.Map', {map: map, mapCenter: center, mapZoom: mapZoom}));
        this.down('segmentedbutton').add([Ext.create('GXM.Button', {
            control: map.controls[1],
            text: AsBuilt.util.Config.getDrawLineButtonText()
        }), Ext.create("GXM.Button", {
            text: AsBuilt.util.Config.getDrawCircleButtonText(),
            control: map.controls[2]
        })]);
        this.callParent(arguments);
    }
});
