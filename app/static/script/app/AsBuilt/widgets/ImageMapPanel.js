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
 *  class = ImageMapPanel
 *  extends = GeoExt.MapPanel
 */

/** api: constructor
 *  .. class:: ImageMapPanel(config)
 *
 *      Create a map panel that displays an image.
 */
AsBuilt.ImageMapPanel = Ext.extend(GeoExt.MapPanel, {

    layerName: null,

    url: null,

    /** private: method[initComponent]
     *  Initializes the map panel. Creates an OpenLayers map if
     *  none was provided in the config options passed to the
     *  constructor.
     */
    initComponent: function(){
        this.items = [{
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        }];
        this.map = {
            controls: [
                new OpenLayers.Control.Navigation({zoomWheelOptions: {interval: 250}}),
                new OpenLayers.Control.PanPanel(),
                new OpenLayers.Control.ZoomPanel(),
                new OpenLayers.Control.Attribution()
            ],
            maxExtent: new OpenLayers.Bounds(
                0, -this.imageWidth,
                this.imageHeight, 0
            ),
            maxResolution: this.imageWidth/256,
            units: 'm',
            projection: "EPSG:404000"
        };
        this.layers = [new OpenLayers.Layer.WMS(
            null,
            this.url,
            {layers: this.layerName, CQL_FILTER: "PATH='"+this.path+"'"}
        )];

        AsBuilt.ImageMapPanel.superclass.initComponent.call(this);
    }

});

/** api: xtype = app_imagemappanel */
Ext.reg('app_imagemappanel', AsBuilt.ImageMapPanel);
