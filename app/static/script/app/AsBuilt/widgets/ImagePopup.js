/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/*
 * @requires AsBuilt/widgets/ImageMapPanel.js
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

    readOnly: true,

    memoField: "MEMO",

    /** private config overrides **/
    layout: "fit",

    border: false,

    getPath: function() {
        // remove first / and add file extension
        return this.feature.attributes.PATH.substring(1) + "." + 
            this.feature.attributes.FILETYPE;
    },

    /** private: method[initComponent]
     */
    initComponent: function() {
        this.addEvents("featuremodified", "canceledit");
        var feature = this.feature;
        if (!this.location) {
            this.location = feature;
        }
        var width = parseInt(feature.attributes.WIDTH, 10);
        var height = parseInt(feature.attributes.HEIGHT, 10);
        var path = this.getPath();
        this.items = [{
            xtype: "tabpanel",
            border: false,
            activeTab: 0,
            items: [{
                xtype: 'app_imagemappanel',
                layerName: this.layerName,
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
                xtype: "form",
                id: "memoform",
                defaults: {
                    style: {
                        margin: "7px"
                    }
                },
                border: false,
                hideLabels: true,
                items: [
                    {
                        xtype: "textarea",
                        width: (this.width) ? this.width-35 : null,
                        grow: true,
                        name: "memo",
                        value: feature.attributes[this.memoField],
                        readOnly: this.readOnly
                    }
                ],
                title: this.attributesTitle,
                bbar: [
                    {
                        hidden: this.readOnly,
                        handler: this.cancelEditing,
                        scope: this,
                        text: "Cancel",
                        iconCls: 'cancel'
                    }, {
                        hidden: this.readOnly,
                        handler: this.saveMemo,
                        scope: this,
                        text: "Save",
                        iconCls: 'save'
                    }
                ]
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
            url: this.url,
            data: request,
            success: function(response) {
                console.log('success handler');
            },
            scope: this
        });
    }, 

    /** private: method[setFeatureState]
      *  Set the state of this popup's feature and trigger a featuremodified
      *  event on the feature's layer.   
      */
    setFeatureState: function(state) {
        this.feature.state = state;
        var layer = this.feature.layer;
        layer && layer.events.triggerEvent("featuremodified", {
            feature: this.feature
        });
    },

    cancelEditing: function() {
        this.setFeatureState(null);
        this.fireEvent("canceledit", this, this.feature);
        this.close();
    },

    saveMemo: function() {
        var value = Ext.getCmp("memoform").getForm().findField('memo').getValue();
        this.feature.attributes[this.memoField] = value;
        this.setFeatureState(OpenLayers.State.UPDATE);
        this.fireEvent("featuremodified", this, this.feature);
    }

});

/** api: xtype = app_imagepopup */
Ext.reg('app_imagepopup', AsBuilt.ImagePopup);
