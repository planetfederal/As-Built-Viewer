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
            mappedButton: 'segmentedbutton[type="mapped"]',
            searchForm: 'app_search',
            mapPanel: 'app_map',
            main: 'main'
        },

        control: {
            searchButton: {
                tap: 'showSearch'
            },
            filterButton: {
                tap: 'filter'
            },
            cancelButton: {
                tap: 'cancelSearch'
            },
            modifyButton: {
                tap: 'showModifySearch'
            },
            resetButton: {
                tap: 'resetSearch'
            },
            main: {
                initialize: 'onInitialize'
            }
        }

    },

    resetSearch: function() {
        var search = Ext.getStore('Search').getAt(0);
        if (search) {
            Ext.getStore('Search').remove(search);
            Ext.getStore('Search').sync();
        }
        this.filterMap();
        if (this.getSearchForm()) {
            this.getSearchForm().getFieldsAsArray().forEach(function(field) {
                field.setValue('');
            });
        }
        this.getModifyButton().hide();
        this.getResetButton().hide();
        this.getSearchButton().show();
    },

    onInitialize: function() {
        var search = Ext.getStore('Search').getAt(0);
        if (search) {
            this.getSearchButton().hide();
            this.getModifyButton().show();
            this.getResetButton().show();
            if (this.getSearchForm()) {
                this.getSearchForm().setValues(search.data);
            }
            var values = Ext.apply({}, search.data);
            delete values.id;
            this.filterMap(values);
        } else {
            // TODO if default strategy is not fixed, change this
            this.getMappedButton().show();
            this.filterMap();
        }
    },

    showSearch: function() {
        this.search(this.getSearchButton());
    },

    showModifySearch: function() {
        this.search(this.getModifyButton());
    },

    search: function(showBy) {
        var sf = this.getSearchForm();
        if (!sf) {
            var search = Ext.create("AsBuilt.view.Search", {
                width: 700,
                zIndex: 1050
            });
            search.showBy(showBy);
        } else {
            if (sf.getHidden()) {
                sf.showBy(showBy);
            } else {
                sf.hide();
            }
        }
        var rec = Ext.getStore('Search').getAt(0);
        if (rec) {
            this.getSearchForm().setValues(rec.data);
        }
    },

    filterMap: function(values, loadend) {
        if (!values || values["BBOX"] !== true) {
            this.getMappedButton().show();
        } else {
            this.getMappedButton().hide();
        }
        var filters = [];
        if (values) {
            for (key in values) {
                if (key !== 'BBOX' && values[key] !== "" && values[key] !== null) {
                    filters.push(new OpenLayers.Filter.Comparison({
                        type: '~',
                        property: key,
                        matchCase: false,
                        value: '*' + values[key] + '*'
                    }));
                }
            }
        }
        var filter = null;
        if (filters.length === 1) {
            filter = filters[0];
        } else if (filters.length > 1) {
            filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: filters
            });
        }
        for (var i=0, ii=this.getMapPanel().getMap().layers.length; i<ii; ++i) {
            var lyr = this.getMapPanel().getMap().layers[i];
            if (lyr instanceof OpenLayers.Layer.WMS) {
                lyr.mergeNewParams({
                    CQL_FILTER: filter !== null ? new OpenLayers.Format.CQL().write(filter): null
                });
            } else if (lyr instanceof OpenLayers.Layer.Vector && lyr.protocol) {
                // store the original filter as well, so it's easier to manipulate in the Filter controller
                lyr._filter = filter;
                lyr.filter = filter;
                if (loadend) {
                    lyr.events.on({'loadend': loadend, scope: this});
                }
                var activated;
                for (var j=0, jj=lyr.strategies.length; j<jj; ++j) {
                    var s = lyr.strategies[j];
                    if (s instanceof OpenLayers.Strategy.BBOX) {
                        if (!values || values['BBOX'] === true) {
                            s.activate();
                        } else {
                            s.deactivate();
                        }
                    }
                    if (s instanceof OpenLayers.Strategy.Fixed) {
                        if (!values || values['BBOX'] === true) {
                            s.deactivate();
                        } else {
                            // if we were already active, we will not be
                            // activated again
                            activated = s.activate();
                        }
                    }
                }
                // activating a strategy will already fetch data
                // but we cannot force a reload on the BBOX strategy
                // other than calling refresh
                if (!activated || (!values || values['BBOX'] === true)) {
                    lyr.refresh({force: true});
                }
            }
        }
    },

    filter: function() {
        this.getSearchForm().getFieldsAsArray().forEach(function(field) {
            if (field.listPanel) {
                field.listPanel.hide();
            }
        });
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
        var loadend = function() {
            this.findVectorLayer().events.un({'loadend': arguments.callee, scope: this});
            this.getSearchForm().unmask();
            this.getSearchForm().hide();
            this.getCancelButton().hide();
            this.getResetButton().show();
            this.getModifyButton().show();
        };
        this.filterMap(values, loadend);
    },

    findVectorLayer: function() {
        var lyr = null;
        for (var i=0, ii=this.getMapPanel().getMap().layers.length; i<ii; ++i) {
            lyr = this.getMapPanel().getMap().layers[i];
            if (lyr instanceof OpenLayers.Layer.Vector && lyr.protocol) {
                break;
            }
        }
        return lyr;
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
