Ext.namespace("AsBuilt");

AsBuilt.GCP = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_gcp */
    ptype: "app_gcp",

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
                        if (this.coords === "image") {
                            this.gcps.push({pixel: geometry});
                        } else if (this.coords === "world") {
                            this.gcps[this.gcps.length-1].lonlat = geometry;
                        }
                    },
                    scope: this
                }
            }
        );
        this.modifyControl = new OpenLayers.Control.ModifyFeature(
            this.layer
        );    
        var toggleGroup = this.toggleGroup || Ext.id();
        var actions = AsBuilt.GCP.superclass.addActions.call(this, [new GeoExt.Action({
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

Ext.preg(AsBuilt.GCP.prototype.ptype, AsBuilt.GCP);
