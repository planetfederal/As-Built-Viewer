/**
 * Class: OpenLayers.Control.DeleteFeature
 * Deletes vector features from a given layer on click. 
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.DeleteFeature = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Property: layer
     * {<OpenLayers.Layer.Vector>}
     */
    layer: null,

    /**
     * APIProperty: callbacks
     * {Object} The functions that are sent to the handler for callback
     */
    callbacks: null,

    /**
     * Property: handler
     * {<OpenLayers.Handler.Feature>}
     */
    handler: null,

    /**
     * Constructor: <OpenLayers.Control.DeleteFeature>
     *
     * Parameters:
     * layer - {<OpenLayers.Layer.Vector>} 
     * options - {Object} 
     */
    initialize: function(layer, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.layer = layer;
        this.callbacks = OpenLayers.Util.extend({
            click: this.clickFeature
        }, this.callbacks);
        this.handler = new OpenLayers.Handler.Feature(this, layer,
                                                      this.callbacks);
    },

    /**
     * Method: destroy
     * The destroy method is used to perform any clean up before the control
     * is dereferenced.  Typically this is where event listeners are removed
     * to prevent memory leaks.
     */
    destroy: function() {
        this.layer = null;
        OpenLayers.Control.prototype.destroy.apply(this,arguments);
    },

    /**
     * Method: clickFeature
     * Called on click in a feature
     * Only responds if this.hover is false.
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>} 
     */
    clickFeature: function(feature) {
        this.layer.destroyFeatures([feature]);
    },

    /** 
     * Method: setMap
     * Set the map property for the control. 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        this.handler.setMap(map);
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },

    CLASS_NAME: "OpenLayers.Control.DeleteFeature"
});
