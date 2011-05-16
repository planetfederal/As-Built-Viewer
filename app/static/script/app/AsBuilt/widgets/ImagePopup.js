/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
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
    attributesTitle: "Description",

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

    /** private: method[initComponent]
     */
    initComponent: function() {
        var feature = this.feature;
        if (!this.location) {
            this.location = feature;
        }
        var width = parseInt(feature.attributes.WIDTH, 10);
        var height = parseInt(feature.attributes.HEIGHT, 10);
        // remove first / and add file extension
        var path = feature.attributes.PATH.substring(1) + "." + feature.attributes.FILETYPE;
        this.items = [{
            xtype: "tabpanel",
            border: false,
            activeTab: 0,
            items: [{
                xtype: 'gx_mappanel',
                border: false,
                items: [
                    {
                        xtype: "gx_zoomslider",
                        vertical: true,
                        height: 100
                    }
                ],
                map: {
                    controls: [
                        new OpenLayers.Control.Navigation({zoomWheelOptions: {interval: 250}}),
                        new OpenLayers.Control.PanPanel(),
                        new OpenLayers.Control.ZoomPanel(),
                        new OpenLayers.Control.Attribution()
                    ],
                    maxExtent:  new OpenLayers.Bounds(
                        0, -width,
                        height, 0
                    ),
                    maxResolution: width/256,
                    units: 'm',
                    projection: "EPSG:404000"
                },
                layers: [new OpenLayers.Layer.WMS(
                    "Image preview",
                    "/geoserver/wms",
                    {layers: "asbuilt:images", CQL_FILTER: "PATH='"+path+"'"}
                )],
                title: this.previewTitle
            }, {
                xtype: "form",
                id: "memoform",
                border: false,
                hideLabels: true,
                items: [
                    {
                        xtype: "textarea",
                        width: (this.width) ? this.width-10 : null,
                        grow: true,
                        name: "memo",
                        value: feature.attributes[this.memoField],
                        readOnly: this.readOnly
                    }
                ],
                title: this.attributesTitle,
                bbar: [{hidden: this.readOnly, handler: this.saveMemo, scope: this, text: "Save", iconCls: 'gxp-icon-save'}]
            }]
        }];
        AsBuilt.ImagePopup.superclass.initComponent.call(this);
    },

    saveMemo: function() {
        var value = Ext.getCmp("memoform").getForm().findField('memo').getValue();
        this.feature.attributes[this.memoField] = value;
    }

});

/** api: xtype = app_imagepopup */
Ext.reg('app_imagepopup', AsBuilt.ImagePopup);
