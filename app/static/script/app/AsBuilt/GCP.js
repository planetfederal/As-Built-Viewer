Ext.namespace("AsBuilt");

AsBuilt.GCP = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_gcp */
    ptype: "app_gcp",

    /** api: method[activate]
     *  :returns: ``Boolean`` true when this tool was activated
     *
     *  Activates this tool. When active, this tool loads the features for the
     *  configured layer, or listens to layer changes on the application and
     *  loads features for the selected layer.
     */
    activate: function() {
        if (AsBuilt.GCP.superclass.activate.apply(this, arguments)) {
            if (this.layer) {
                this.target.createLayerRecord(this.layer, this.setLayer, this);
            }
            return true;
        }
    },

    setLayer: function(layerRecord) {
        this.layerRecord = layerRecord;
        var layer = this.layerRecord.get("layer");
        this.target.mapPanel.map.addLayer(layer);
        this.drawControl.layer = layer;
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.drawControl = new OpenLayers.Control.DrawFeature(
            new OpenLayers.Layer.Vector(),    
            OpenLayers.Handler.Point, {
                eventListeners: {
                    featureadded: function(evt) {
                        var geometry = evt.feature.geometry;
                        this.drawControl.deactivate();
                        if (this.coords === "image") {
                            var pixel = new OpenLayers.Pixel(geometry.x, geometry.y);
                            this.gcps.push({pixel: pixel});
                        } else if (this.coords === "world") {
                            var lonlat = new OpenLayers.LonLat(geometry.x, geometry.y);
                            this.gcps[this.gcps.length-1].lonlat = lonlat;
                        }
                    },
                    scope: this
                }
            }
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
        })]);
    }

});

Ext.preg(AsBuilt.GCP.prototype.ptype, AsBuilt.GCP);
