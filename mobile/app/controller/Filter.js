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
        this.filterWMS(true);
    },
                
    filterWMS: function(mapped) {
        var layer = this.getWMSLayer();
        var cql = layer.params.CQL_FILTER;
        var cqlToAdd;
        if (mapped) { 
            cqlToAdd = 'GEOM IS NOT NULL';
        } else {
            cqlToAdd = 'GEOM IS NULL';
        }
        if (cql !== null) {
            // TODO this does not work, since the other one could have been set
            // TODO as Filter.IsNull to CQL Format
            if (cql.indexOf(cqlToAdd) === -1) {
                cql = '(' + cql + ') AND (' + cqlToAdd + ')';
            }
        } else {
            cql = cqlToAdd;
        }
        this.getWMSLayer().mergeNewParams({'CQL_FILTER': cql});
    },

    filterMapped: function() {
        this.filterWMS(true);
    },

    filterUnmapped: function() {
        this.filterWMS(false);
    }

});
