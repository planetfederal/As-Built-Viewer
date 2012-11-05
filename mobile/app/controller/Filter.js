Ext.define('AsBuilt.controller.Filter', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            mapPanel: 'app_map',
            allButton: 'button[text="All"]',
            mappedButton: 'button[text="Mapped"]',
            unmappedButton: 'button[text="Unmapped"]'
        },

        control: {
            allButton: {
                tap: 'filterAll'
            },
            mappedButton: {
                tap: 'filterMapped'
            },
            unmappedButton: {
                tap: 'filterUnmapped'
            }
        }
    },

    getVectorLayer: function() {
        var lyr;
        for (var i=0, ii=this.getMapPanel().getMap().layers.length; i<ii; ++i) {
            lyr = this.getMapPanel().getMap().layers[i];
            if (lyr instanceof OpenLayers.Layer.Vector && lyr.protocol) {
                break;
            }
        }
        return lyr;
    },

    getWMSLayer: function() {
        var lyr;
        for (var i=0, ii=this.getMapPanel().getMap().layers.length; i<ii; ++i) {
            lyr = this.getMapPanel().getMap().layers[i];
            if (lyr instanceof OpenLayers.Layer.WMS) {
                break;
            }
        }
        return lyr;
    },

    filterAll: function() {
        this.filter('all');
    },

    filter: function(mode) {
        var vector = this.getVectorLayer();
        var activateFixed = function() {
            for (var i=0, ii=vector.strategies.length; i<ii; ++i) {
                var s = vector.strategies[i];
                if (s instanceof OpenLayers.Strategy.BBOX) {
                    s.deactivate();
                }
                if (s instanceof OpenLayers.Strategy.Fixed) {
                    var activated = s.activate();
                    if (!activated) {
                        vector.refresh({force: true});
                    }
                }
            }
        };
        // TODO add check for existing filter
        var nullGeomFilter = new OpenLayers.Filter.Comparison({
            property: "GEOM",
            type: OpenLayers.Filter.Comparison.IS_NULL
        });
        if (mode === 'all') {
            vector.filter = null;
            activateFixed();
        } else if (mode === 'unmapped') {
            vector.filter = nullGeomFilter;
            activateFixed();
        } else if (mode === 'mapped') {
            // we need to add a filter for NOT (GEOM IS NULL)
            vector.filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.NOT,
                filters: [nullGeomFilter]
            });
            // not sure which strategy we should be using here, BBOX or Fixed
            vector.refresh({force: true});
        }
        var cql = null;
        if (vector.filter) {
            cql = new OpenLayers.Format.CQL().write(vector.filter);
        }
        this.getWMSLayer().mergeNewParams({
            'CQL_FILTER': cql
        });
    },

    filterMapped: function() {
        this.filter('mapped');
    },

    filterUnmapped: function() {
        this.filter('unmapped');
    }

});
