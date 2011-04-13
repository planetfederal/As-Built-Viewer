Ext.namespace("AsBuilt.plugins");

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

AsBuilt.plugins.GCP = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_gcp */
    ptype: "app_gcp",

    gcpManager: null,

    /** api: config[type]
     * ``Integer`` Coordinate system type to use, one of: 
     * AsBuilt.plugins.GCP.WORLD_COORDS or
     * AsBuilt.plugins.GCP.IMAGE_COORDS
     */
    type: null,

    constructor: function(config) {
        this.addEvents(
            /** api: event[beforegcpadded]
             *  Fired before a (part of a) gcp has been added. Return false 
             *  to cancel.
             *
             *  Listener arguments:
             *  * tool - :class:`AsBuilt.plugins.GCP` this tool
             *  * feature - :class: `OpenLayers.Feature.Vector` the feature created
             */
            "beforegcpadded",

            /** api: event[gcpadded]
             *  Fired when a (part of a) gcp has been added.
             *
             *  Listener arguments:
             *  * tool - :class:`AsBuilt.plugins.GCP` this tool
             *  * feature - :class: `OpenLayers.Feature.Vector` the feature created
             */
            "gcpadded",

            /** api: event[gcpremoved]
             *  Fired when a (part of a) gcp has been removed.
             *
             *  Listener arguments:
             *  * tool - :class:`AsBuilt.plugins.GCP` this tool
             *  * feature - :class: `OpenLayers.Feature.Vector` the feature created
             */
            "gcpremoved"
        );
        AsBuilt.plugins.GCP.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.on({
            "beforegcpadded": this.gcpManager.handleBeforeGCPAdded,
            "gcpadded": this.gcpManager.handleGCPAdded,
            "gcpremoved": this.gcpManager.handleGCPRemoved
        });
        this.layer = new OpenLayers.Layer.Vector();
        this.layer.events.on({
            "sketchcomplete": function(evt) {
                return this.fireEvent("beforegcpadded", this, evt.feature);
            },
            "featureremoved": function(evt) { 
                this.fireEvent("gcpremoved", this, evt.feature);
            },
            scope: this
        });
        this.drawControl = new OpenLayers.Control.DrawFeature(
            this.layer,    
            OpenLayers.Handler.Point, {
                eventListeners: {
                    featureadded: function(evt) {
                        if (!this.layer.map) {
                            this.target.mapPanel.map.addLayer(this.layer);
                        }
                        this.drawControl.deactivate();
                        this.fireEvent("gcpadded", this, evt.feature);
                    },
                    scope: this
                }
            }
        );
        this.modifyControl = new OpenLayers.Control.ModifyFeature(
            this.layer
        );
        this.deleteControl = new OpenLayers.Control.DeleteFeature(
            this.layer
        );
        var toggleGroup = this.toggleGroup || Ext.id();
        var actions = AsBuilt.plugins.GCP.superclass.addActions.call(this, [new GeoExt.Action({
            tooltip: "Draw GCP",
            text: "Draw GCP",
            toggleGroup: toggleGroup,
            enableToggle: true,
            allowDepress: true,
            control: this.drawControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        }), new GeoExt.Action({
            tooltip: "Edit GCP",
            text: "Edit GCP",
            toggleGroup: toggleGroup,
            enableToggle: true,
            allowDepress: true,
            control: this.modifyControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        }), new GeoExt.Action({
            tooltip: "Delete GCP",
            text: "Delete GCP",
            toggleGroup: toggleGroup,
            enableToggle: true,
            allowDepress: true,
            control: this.deleteControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        })]);
    }

});

/**
 * Coordinate types
 */
AsBuilt.plugins.GCP.WORLD_COORDS = 0;
AsBuilt.plugins.GCP.IMAGE_COORDS = 1;

Ext.preg(AsBuilt.plugins.GCP.prototype.ptype, AsBuilt.plugins.GCP);
