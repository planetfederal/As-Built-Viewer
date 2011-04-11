Ext.namespace("AsBuilt.plugins");

AsBuilt.plugins.GCP = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_gcp */
    ptype: "app_gcp",

    /** api: config[type]
     * ``Integer`` Coordinate system type to use, one of: 
     * AsBuilt.plugins.GCP.WORLD_COORDS or
     * AsBuilt.plugins.GCP.IMAGE_COORDS
     */
    type: null,

    constructor: function(config) {
        this.addEvents(
            /** api: event[gcpadded]
             *  Fired when a (part of a) gcp has been added.
             *
             *  Listener arguments:
             *  * tool - :class:`AsBuilt.plugins.GCP` this tool
             *  * geometry - :class: `OpenLayers.Geometry` the geometry created
             */
            "gcpadded"
        );
        AsBuilt.plugins.GCP.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.layer = new OpenLayers.Layer.Vector();
        this.drawControl = new OpenLayers.Control.DrawFeature(
            this.layer,    
            OpenLayers.Handler.Point, {
                eventListeners: {
                    featureadded: function(evt) {
                        if (!this.layer.map) {
                            this.target.mapPanel.map.addLayer(this.layer);
                        }
                        var geometry = evt.feature.geometry;
                        this.drawControl.deactivate();
                        this.fireEvent("gcpadded", this, geometry);
                    },
                    scope: this
                }
            }
        );
        this.modifyControl = new OpenLayers.Control.ModifyFeature(
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
        })]);
    }

});

/**
 * Coordinate types
 */
AsBuilt.plugins.GCP.WORLD_COORDS = 0;
AsBuilt.plugins.GCP.IMAGE_COORDS = 1;

Ext.preg(AsBuilt.plugins.GCP.prototype.ptype, AsBuilt.plugins.GCP);
