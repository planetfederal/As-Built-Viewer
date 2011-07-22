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

    projection: null,

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
        var maxExtent, maxResolution, projection, extent, numZoomLevels;
        this.layers = [];
        if (this.projection === "EPSG:3857") {
            maxExtent = new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34);
            numZoomLevels = 21;
            extent = new OpenLayers.Bounds(-13650159, 4534735, -13609227, 4554724);
            maxResolution = 156543.03390625;
            projection = this.projection;
            this.layers.push(new OpenLayers.Layer.OSM());
        } else {
            maxExtent = new OpenLayers.Bounds(
                0, -this.imageWidth,
                this.imageHeight, 0); 
            maxResolution = this.imageWidth/256;
            projection = "EPSG:404000";
        }
        this.map = {
            controls: [
                new OpenLayers.Control.Navigation({zoomWheelOptions: {interval: 250}}),
                new OpenLayers.Control.PanPanel(),
                new OpenLayers.Control.ZoomPanel(),
                new OpenLayers.Control.Attribution()
            ],
            maxExtent: maxExtent,
            numZoomLevels: numZoomLevels,
            maxResolution: maxResolution,
            projection: projection,
            units: 'm'
        };
        this.extent = extent;
        this.layers.push(new OpenLayers.Layer.WMS(
            null,
            this.url,
            {layers: this.layerName, CQL_FILTER: "PATH='"+this.path+"'"}
        ));

        AsBuilt.ImageMapPanel.superclass.initComponent.call(this);
    }

});

/** api: xtype = app_imagemappanel */
Ext.reg('app_imagemappanel', AsBuilt.ImageMapPanel);
