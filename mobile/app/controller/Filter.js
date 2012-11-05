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
        var filter = this.getVectorLayer().filter;
        var cqlToAdd = null;
        if (!mapped) { 
            cqlToAdd = 'GEOM IS NULL';
        }
        if (filter) {
            cql = new OpenLayers.Format.CQL().write(filter);
            if (cqlToAdd !== null) {
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
