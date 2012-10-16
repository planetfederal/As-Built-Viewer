Ext.define('AsBuilt.controller.Search', {
    extend: 'Ext.app.Controller',
    requires: ['AsBuilt.view.Search'],
    config: {
        refs: {
            searchButton: 'button[iconCls="search"]',
            cancelButton: 'button[text="Cancel"]',
            modifyButton: 'button[text="Modify Search"]',
            resetButton: 'button[text="Reset"]',
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
            },
            cancelButton: {
                tap: 'cancelSearch'
            }
        }

    },

    launch: function() {
        Ext.getStore('Search').load({
            callback: this.onSearchStoreLoad,
            scope: this
        });
    },

    onSearchStoreLoad: function() {
        var search = Ext.getStore('Search').getAt(0);
        if (search && this.getSearchForm()) {
            this.getSearchForm().setValues(search.data);
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
        var rec = Ext.getStore('Search').getAt(0);
        if (rec) {
            this.getSearchForm().setValues(rec.data);
        }
    },

    filter: function() {
        var values = this.getSearchForm().getValues();
        var rec = Ext.getStore('Search').getAt(0);
        var key;
        if (rec) {
            for (key in values) {
                rec.set(key, values[key]);
            }
        } else {
            Ext.getStore('Search').add(new AsBuilt.model.Search(values));
        }
        Ext.getStore('Search').sync();
        this.getSearchButton().hide();
        this.getCancelButton().show();
        this.getSearchForm().mask({
            xtype: 'loadmask',
            message: 'Searching'
        });
        var filters = [];
        for (key in values) {
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
                lyr.events.on({'loadend': function() {
                    lyr.events.un({'loadend': arguments.callee, scope: this});
                    this.getSearchForm().unmask();
                    this.getSearchForm().hide();
                    this.getCancelButton().hide();
                    this.getResetButton().show();
                    this.getModifyButton().show();
                }, scope: this});
                lyr.filter = filter;
                lyr.refresh({force: true});
            }
        }
    },

    cancelSearch: function() {
        for (var i=0, ii=this.getMapPanel().getMap().layers.length; i<ii; ++i) {
            var lyr = this.getMapPanel().getMap().layers[i];
            if (lyr instanceof OpenLayers.Layer.Vector && lyr.protocol) {
                lyr.protocol.abort();
            }
        }
    }

});
