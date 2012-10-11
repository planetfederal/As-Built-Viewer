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
        var sf = this.getSearchForm();
        if (!sf) {
            var search = Ext.create("AsBuilt.view.Search", {
                width: 400,
                height: 400,
                zIndex: 1000
            });
            search.showBy(this.getSearchButton());
        } else {
            if (sf.getHidden()) {
                sf.show();
            } else {
                sf.hide();
            }
        }
    },

    filter: function() {
        var values = this.getSearchForm().getValues();
        var filters = [];
        for (var key in values) {
            if (values[key] !== "") {
                filters.push(new OpenLayers.Filter.Comparison({
                    type: '==',
                    property: key,
                    value: values[key]
                }));
            }
        }
        var filter;
        if (filters.length === 1) {
            filter = filters[0];
        } else {
            filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: filters
            });
        }
        for (var i=0, ii=this.getMapPanel().getMap().layers.length; i<ii; ++i) {
            var lyr = this.getMapPanel().getMap().layers[i];
            if (lyr instanceof OpenLayers.Layer.WMS) {
                lyr.mergeNewParams({
                    CQL_FILTER: new OpenLayers.Format.CQL().write(filter)
                });
            } else if (lyr instanceof OpenLayers.Layer.Vector && lyr.protocol) {
                lyr.filter = filter;
                lyr.refresh({force: true});
            }
        }
    }

});
