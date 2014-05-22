/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/*
 * @requires AsBuilt/widgets/ImageMapPanel.js
 * @requires OpenLayers/Format/WPSExecute.js
 * @requires widgets/grid/FeatureGrid.js
 */

Ext.namespace("AsBuilt");

/** api: (define)
 *  module = AsBuilt
 *  class = ImagePopup
 *  extends = GeoExt.Popup
 */

/** api: constructor
 *  .. class:: ImagePopup(config)
 *
 *      Create a new popup which displays an image preview.
 */
AsBuilt.ImagePopup = Ext.extend(GeoExt.Popup, {

    unsavedTitle: "Unsaved changes",
    unsavedMsg: "You have unsaved changes to the notes on this image.  Are you sure you want to continue?",

    /**
     * api: config[zoomLevel]
     * ``Integer`` The zoom level to use when displaying a rectified image.
     */
    zoomLevel: 14,

    readOnly: true,

    /** private config overrides **/
    layout: "fit",

    border: false,

    getPath: function() {
        // remove first / and add file extension
        var feature = this.feature.getFeature();
        var path = feature.attributes.PATH;
        if (path.charAt(0) === "/") {
            path = path.substring(1);
        }
        return path + "." + 
            feature.attributes.FILETYPE;
    },

    onBeforeClose: function() {
        var store = this.grid.store;
        if (store.getModifiedRecords().length > 0 || store.removed.length > 0) {
            Ext.Msg.confirm(this.unsavedTitle, this.unsavedMsg, function(btn) {
                if (btn === "yes") {
                    this.un("beforeclose", this.onBeforeClose, this);
                    this.close();
                }
            }, this);
            return false;
        }
    },

    /** private: method[initComponent]
     */
    initComponent: function() {
        this.on('beforeclose', this.onBeforeClose, this);
        this.addEvents("featuremodified", "canceledit");
        var feature = this.feature.getFeature();
        if (!this.location) {
            this.location = feature;
        }
        var mgr = this.notesManager;
        var docID = feature.fid.split(".").pop();
        mgr.loadFeatures(new OpenLayers.Filter.Comparison({
            type: '==',
            property: 'DOC_ID',
            value: docID
        }));
        var width = parseInt(feature.attributes.WIDTH, 10);
        var height = parseInt(feature.attributes.HEIGHT, 10);
        var path = this.getPath();
        var layerName, center, zoom;
        var projection = null;
        if (!Ext.isEmpty(feature.attributes.LAYER)) {
            layerName = this.rectifiedLayerName;
            projection = "EPSG:3857";
            center = new OpenLayers.LonLat(this.location.geometry.x, this.location.geometry.y);
            zoom = this.zoomLevel;
        } else {
            layerName = this.layerName;
        }
        var editor = new Ext.ux.grid.RowEditor({saveText: 'Update'});
        this.items = [{
            xtype: "container",
            layout: "vbox",
            layoutConfig: {
                align: 'stretch'
            },
            border: false,
            items: [{
                xtype: 'app_imagemappanel',
                ref: "../mappanel",
                flex: 1,
                layerName: layerName,
                center: center,
                zoom: zoom,
                projection: projection,
                url: this.url,
                imageWidth: width,
                imageHeight: height,
                path: path,
                border: false
            }, {
                xtype: 'container',
                layout: 'fit',
                height: 200,
                items: [{
                    xtype: "gxp_featuregrid",
                    ref: "../../grid",
                    customRenderers: {
                        'NOTE': function(value, meta) { 
                            meta.attr = 'style="white-space:normal"'; 
                            return value;
                        },
                        'UPDATED_DT': function(value) {
                            if (value !== "" && value !== undefined) {
                                return Date.parseDate(value, 'c').format('F j, Y, g:i a');
                            } else {
                                return value;
                            }
                        }
                    },
                    customEditors: {
                        'NOTE': {
                            xtype: 'textarea'
                        }
                    },
                    columnConfig: {
                        'UPDATED_DT': {
                            editable: false,
                            width: 0.3*this.width
                        },
                        'NOTE': {
                            width: 0.5*this.width
                        },
                        'CREATED_BY': {
                            width: 0.2*this.width
                        }
                    },
                    createColumnModel: function(store) {
                        var columns = this.getColumns(store);
                        var order = {'NOTE' :0, 'CREATED_BY': 1, 'UPDATED_DT': 2};
                        columns.sort(function(a, b) {
                            return order[a.dataIndex] - order[b.dataIndex];
                        });
                        return new Ext.grid.ColumnModel(columns);
                    },
                    ignoreFields: ['DOC_ID', 'ANNOTATION'],
                    sm: new Ext.grid.RowSelectionModel({
                        listeners: {
                            selectionchange: function(sm) {
                                if (!this.readOnly) {
                                    this.grid.removeBtn.setDisabled(sm.getCount() < 1);
                                }
                                var record = sm.getSelected();
                                if (record) {
                                    var json = record.get('ANNOTATION');
                                    if (!this.annotationLayer) {
                                        var stylemap = new OpenLayers.StyleMap({
                                            'default': new OpenLayers.Style({
                                                fillColor: "#FF0000",
                                                fillOpacity: 0,
                                                strokeColor: "#FF0000"
                                            })
                                        });
                                        this.annotationLayer = new OpenLayers.Layer.Vector(null, {styleMap: stylemap});
                                        this.mappanel.map.addLayer(this.annotationLayer);
                                    }
                                    this.annotationLayer.removeAllFeatures();
                                    if (!this.format) {
                                        this.format = new OpenLayers.Format.GeoJSON();
                                    }
                                    if (!Ext.isEmpty(json)) {
                                        var features = this.format.read(json);
                                        this.annotationLayer.addFeatures(features);
                                    }
                                }
                            },
                            scope: this
                        }
                    }),
                    plugins: this.readOnly ? undefined : [editor],
                    tbar: [{
                        iconCls: 'add',
                        text: 'Add Note',
                        handler: function() {
                            Ext.MessageBox.prompt('Insert new note', 'Note', function(btn, text) {
                                if (btn === 'ok') {
                                    var recordType = GeoExt.data.FeatureRecord.create([{name: "DOC_ID"}, {name: "CREATED_BY"}, {name: "NOTE"}]);
                                    var feature = new OpenLayers.Feature.Vector(null, {"NOTE": text, "DOC_ID": docID});
                                    feature.state = OpenLayers.State.INSERT;
                                    var record = new recordType();
                                    record.beginEdit();
                                    record.set('feature', feature);
                                    record.endEdit(); 
                                    this.grid.store.insert(0, record);
                                    this.grid.store.save();
                                }
                            }, this, true);
                        },
                        scope: this
                    },{
                        iconCls: 'delete',
                        hidden: this.readOnly,
                        ref: '../removeBtn',
                        text: 'Remove Note',
                        disabled: true,
                        handler: function(){
                            editor.stopEditing();
                            var s = this.grid.getSelectionModel().getSelections();
                            for(var i = 0, r; r = s[i]; i++){
                                r.getFeature().state = OpenLayers.State.DELETE;
                                this.grid.store.remove(r);
                            }
                        },
                        scope: this
                    }, '-', {
                        text: "Save",
                        iconCls: 'save',
                        hidden: this.readOnly,
                        handler: function() {
                            this.grid.store.save();
                        },
                        scope: this
                    }, '->', {
                        hidden: this.readOnly,
                        handler: this.downloadImage,
                        scope: this,
                        text: "Download",
                        iconCls: "download"
                    }],
                    store: mgr.featureStore
                }]
            }]
        }];
        AsBuilt.ImagePopup.superclass.initComponent.call(this);
    },

    downloadImage: function() {
        // issue a WPS Execute request to get the image
        // build up the WPS Execute request
        var format = new OpenLayers.Format.WPSExecute();
        var request = format.write({
            identifier: 'gs:GetFullCoverage',
            dataInputs: [{
                identifier: 'name',
                data: {
                    literalData: {
                        value: this.layerName
                    }
                }
            }, {
                identifier: 'filter',
                data: {
                    complexData: {
                        mimeType: 'text/plain; subtype=cql',
                        value: "path = '" + this.getPath() + "'"
                    }
                }
            }],
            responseForm: {
                rawDataOutput: {
                    mimeType: "image/tiff",
                    identifier: "result"
                }
            }
        });

        OpenLayers.Request.POST({
            url: OpenLayers.Util.urlAppend(this.url, "content-disposition=attachment"),
            data: request,
            scope: this
        });
    },

    beforeDestroy: function() {
        delete this.annotationLayer;
        delete this.format;
        AsBuilt.ImagePopup.superclass.beforeDestroy.call(this);
    }

});

/** api: xtype = app_imagepopup */
Ext.reg('app_imagepopup', AsBuilt.ImagePopup);
