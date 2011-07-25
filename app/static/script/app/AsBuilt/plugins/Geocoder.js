/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = AsBuilt.plugins
 *  class = Geocoder
 */

/** api: (extends)
 *  gxp/plugins/Tool.js
 */
Ext.namespace("AsBuilt.plugins");

/** api: constructor
 *  .. class:: Geocoder(config)
 *
 *    Plugin for adding a GeocoderComboBox to a viewer. The underlying
 *    AutoCompleteComboBox can be configured by setting this tool's 
 *    ``outputConfig`` property.
 */
AsBuilt.plugins.Geocoder = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = app_geocoder */
    ptype: "app_geocoder",

    /** api:config[zoom]
     * ``Integer`` Zoom level to zoom to when an address is selected.
     * Defaults to 16.
     */
    zoom: 16,

    init: function(target) {

        var combo = new gxp.form.AutoCompleteComboBox(Ext.apply({
            listeners: {
                select: this.onComboSelect,
                scope: this
            }
        }, this.outputConfig));
        
        var bounds = target.mapPanel.map.restrictedExtent;
        if (bounds && !combo.bounds) {
            target.on({
                ready: function() {
                    combo.bounds = bounds.clone().transform(
                        target.mapPanel.map.getProjectionObject(),
                        new OpenLayers.Projection("EPSG:4326"));
                }
            });
        }
        this.combo = combo;
        
        return AsBuilt.plugins.Geocoder.superclass.init.apply(this, arguments);

    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        return AsBuilt.plugins.Geocoder.superclass.addOutput.call(this, this.combo);
    },
    
    /** private: method[onComboSelect]
     *  Listener for combo's select event.
     */
    onComboSelect: function(combo, record) {
        var map = this.target.mapPanel.map;
        var location = record.get("feature").geometry;
        if (location instanceof OpenLayers.Geometry.Point) {
            map.setCenter(new OpenLayers.LonLat(location.x, location.y), this.zoom);
        }
    }

});

Ext.preg(AsBuilt.plugins.Geocoder.prototype.ptype, AsBuilt.plugins.Geocoder);
