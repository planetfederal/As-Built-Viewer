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

    /** api: config[attributesTitle]
     *  ``String``
     *  Title for attributes tab (i18n).
     */
    attributesTitle: "Notes",

    /** api: config[previewTitle]
     *  ``String``
     *  Title for image preview tab (i18n).
     */
    previewTitle: "Image preview",

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
        if (feature.attributes.LAYER !== null) {
            layerName = this.rectifiedLayerName;
            projection = "EPSG:3857";
            center = new OpenLayers.LonLat(this.location.geometry.x, this.location.geometry.y);
            zoom = this.zoomLevel;
        } else {
            layerName = this.layerName;
        }
        var editor = new Ext.ux.grid.RowEditor({saveText: 'Update'});
        this.items = [{
            xtype: "tabpanel",
            border: false,
            activeTab: 0,
            items: [{
                xtype: 'app_imagemappanel',
                layerName: layerName,
                center: center,
                zoom: zoom,
                projection: projection,
                url: this.url,
                imageWidth: width,
                imageHeight: height,
                path: path,
                border: false,
                title: this.previewTitle,
                bbar: [
                    {
                        hidden: this.readOnly,
                        handler: this.downloadImage,
                        scope: this,
                        text: "Download",
                        iconCls: "download"
                    }
                ]
            }, {
                xtype: "gxp_featuregrid",
                ref: "../grid",
                viewConfig: {
                    forceFit: true
                },
                customRenderers: {
                    'NOTE': function(value, meta) { 
                        meta.attr = 'style="white-space:normal"'; 
                        return value;
                    },
                    'TIMESTAMP': function(value) {
                        if (value !== "") {
                            return Date.parseDate(value, 'c').format('F j, Y, g:i a');
                        } else {
                            return value;
                        }
                    }
                },
                customEditors: {
                    'NOTE': {
                        xtype: 'textarea'
                    },
                    'TIMESTAMP': null
                },
                columnConfig: {
                    'TIMESTAMP': {
                        editable: false
                    }
                },
                createColumnModel: function(store) {
                    var columns = this.getColumns(store);
                    var order = {'NOTE' :0, 'AUTHOR': 1, 'TIMESTAMP': 2};
                    columns.sort(function(a, b) {
                        return order[a.dataIndex] > order[b.dataIndex];
                    });
                    return new Ext.grid.ColumnModel(columns);
                },
                ignoreFields: ['DOC_ID'],
                sm: this.readOnly ? undefined : new Ext.grid.RowSelectionModel({
                    listeners: {
                        selectionchange: function(sm) {
                            this.grid.removeBtn.setDisabled(sm.getCount() < 1);
                        },
                        scope: this
                    }
                }),
                plugins: this.readOnly ? undefined : [editor],
                bbar: this.readOnly ? undefined : [{
                    text: "Save",
                    iconCls: 'save',
                    handler: function() {
                        this.grid.store.save();
                    },
                    scope: this
                }],
                tbar: this.readOnly ? undefined : [{
                    iconCls: 'add',
                    text: 'Add Note',
                    handler: function() { 
                        editor.stopEditing();
                        var recordType = GeoExt.data.FeatureRecord.create([{name: "DOC_ID"}, {name: "AUTHOR"}, {name: "NOTE"}]);
                        var feature = new OpenLayers.Feature.Vector();
                        feature.state = OpenLayers.State.INSERT;
                        this.grid.store.insert(0, new recordType({feature: feature, DOC_ID: docID}));
                        this.grid.getView().refresh();
                        this.grid.getSelectionModel().selectRow(0);
                        editor.startEditing(0);
                    },
                    scope: this
                },{
                    iconCls: 'delete',
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
                }],
                store: mgr.featureStore,
                width: this.width,
                height: this.height,
                title: this.attributesTitle
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
    }

});

/** api: xtype = app_imagepopup */
Ext.reg('app_imagepopup', AsBuilt.ImagePopup);
