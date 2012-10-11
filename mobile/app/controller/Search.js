Ext.define('AsBuilt.controller.Search', {
    extend: 'Ext.app.Controller',
    requires: ['AsBuilt.view.Search'],
    config: {
        refs: {
            searchButton: 'button[iconCls="search"]',
            filterButton: 'button[text="Search"]',
            searchForm: 'app_search',
            mapPanel: 'app_map'
        },

        control: {
            searchButton: {
                tap: 'search'
            },
            filterButton: {
                tap: 'filter'
            }
        }

    },

    search: function() {
        var search = Ext.create("AsBuilt.view.Search", {
            width: 400,
            height: 200,
            zIndex: 1000
        });
        search.showBy(this.getSearchButton());
    },

    filter: function() {
        var values = this.getSearchForm().getValues();
        var cql = '';
        for (var key in values) {
            cql += key + "='" + values[key] + "'";
        }
        for (var i=0, ii=this.getMapPanel().getMap().layers.length; i<ii; ++i) {
            var lyr = this.getMapPanel().getMap().layers[i];
            if (lyr instanceof OpenLayers.Layer.WMS) {
                lyr.mergeNewParams({
                    CQL_FILTER: cql
                });
            }
        }
    }

});
