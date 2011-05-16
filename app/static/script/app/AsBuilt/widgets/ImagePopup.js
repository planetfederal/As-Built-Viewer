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
    attributesTitle: "Attributes",

    /** api: config[previewTitle]
     *  ``String``
     *  Title for image preview tab (i18n).
     */
    previewTitle: "Image preview",

    /** private config overrides **/
    layout: "fit",

    /** private: method[initComponent]
     */
    initComponent: function() {
        var feature = this.feature;
        if (!this.location) {
            this.location = feature;
        }
        this.items = [{
            xtype: "tabpanel",
            border: false,
            activeTab: 0,
            items: [{
                xtype: 'gx_mappanel',
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
                        0, -4097,
                        6696, 0
                    ),
                    maxResolution: 26.15625,
                    units: 'm',
                    projection: "EPSG:404000"
                },
                layers: [new OpenLayers.Layer.WMS(
                    "Image preview",
                    "/geoserver/wms",
                    {layers: "asbuilt:images", CQL_FILTER: 'PATH=\'MR894_MUNI-METRO_MARKET_ST_TRACK_REPLACE-PHASE_3/CL-7449.TIF\''}
                )],
                title: this.previewTitle
            }, {
                xtype: "panel",
                title: this.attributesTitle
            }]
        }];
        AsBuilt.ImagePopup.superclass.initComponent.call(this);
    }

});

/** api: xtype = app_imagepopup */
Ext.reg('app_imagepopup', AsBuilt.ImagePopup);
