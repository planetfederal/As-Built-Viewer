Ext.define('AsBuilt.controller.Filter', {
    extend: 'Ext.app.Controller',
    requires: [
        'AsBuilt.util.Config'
    ],
    statics: {
        'FILTER_ALL': 0,
        'FILTER_MAPPED': 1,
        'FILTER_UNMAPPED': 2
    },
    config: {
        refs: {
            mapPanel: 'app_map',
            allButton: '#filter_all',
            mappedButton: '#filter_mapped',
            unmappedButton: '#filter_unmapped'
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
        this.filter(this.self.FILTER_ALL);
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
        var nullGeomFilter = new OpenLayers.Filter.Comparison({
            property: AsBuilt.util.Config.getGeomField(),
            type: OpenLayers.Filter.Comparison.IS_NULL
        });
        if (mode === this.self.FILTER_ALL) {
            if (!vector._filter) {
                vector.filter = null;
            } else {
                vector.filter = vector._filter;
            }
            activateFixed();
        } else if (mode === this.self.FILTER_UNMAPPED) {
            if (vector._filter) {
                vector.filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.AND,
                    filters: [
                        nullGeomFilter,
                        vector._filter
                    ]
                });
            } else {
                vector.filter = nullGeomFilter;
            }
            activateFixed();
        } else if (mode === this.self.FILTER_MAPPED) {
            // we need to add a filter for NOT (GEOM IS NULL)
            var mappedFilter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.NOT,
                filters: [nullGeomFilter]
            });
            if (vector._filter) {
                vector.filter = new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.AND,
                    filters: [
                        mappedFilter,
                        vector._filter
                    ]
                });
            } else {
                vector.filter = mappedFilter;
            }
            // TODO not sure which strategy we should be using here, BBOX or Fixed
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
        this.filter(this.self.FILTER_MAPPED);
    },

    filterUnmapped: function() {
        this.filter(this.self.FILTER_UNMAPPED);
    }

});
