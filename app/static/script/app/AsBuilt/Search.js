/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

Ext.ns("AsBuilt");

/** api: (define)
 *  module = AsBuilt
 *  class = Search
 *  extends = gxp.plugins.Tool
 */

/** api: constructor
 *  .. class:: Search(config)
 *
 *    Search for images.
 */
AsBuilt.Search = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_search */
    ptype: "app_search",

    /** api: config[featureManager]
     *  ``String`` The id of the :class:`gxp.plugins.FeatureManager` to use
     *  with this tool.
     */
    featureManager: null,

    /** api: config[attributeLabel]
     *  ``String``
     *  Label for attributes fieldset (i18n).
     */
    attributeLabel: "Image attributes",

    /** api: config[streetLabel]
     *  ``String``
     *  Label for street fieldset (i18n).
     */
    streetLabel: "Street location",

    /** api: config[queryActionText]
     *  ``String``
     *  Text for query action (i18n).
     */
    queryActionText: "Query",

    /** private: cnns
     * ``Array(String)`` List of center network node identifiers
     * to use in the search.
     */
    cnns: null,

    /** api: method[init]
     *  :arg target: ``gxp.Viewer``
     *  Initialize the plugin.
     */
    init: function(target) {
        AsBuilt.Search.superclass.init.apply(this, arguments);
        this.initContainer();
    },

    addActions: function(config) {
        this.addOutput();
        return AsBuilt.Search.superclass.addActions.call(this, []);
    },

    getCnnList: function() {
        var street = Ext.getCmp('streetname').getValue();
        var start = Ext.getCmp('start_intersection').getValue();
        var end = Ext.getCmp('end_intersection').getValue();
        if (street != "" && start != "" && end != "") {
            Ext.Ajax.request({
                url: '/stub/cnn.json',
                params: {street: street, startIntersection: start, endIntersection: end},
                success: function(response) {
                    var reader = new Ext.data.JsonReader({
                        root: 'cnns',
                        idProperty: 'id',
                        fields: ['id']
                    });
                    var ids = reader.read(response);
                    this.cnns = [];
                    for (var i=0,ii=ids.records.length;i<ii;i++) {
                        this.cnns.push(ids.records[i].get('id'));
                    }
                },
                failure: function() {
                    // TODO handle failure
                },
                scope: this
            });
        }
    },

    performSearch: function() {
        var featureManager = this.target.tools[this.featureManager];
        var filters = [];
        // always use a BBOX filter
        filters.push(new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.BBOX,
            property: featureManager.featureStore.geometryName,
            value: this.target.mapPanel.map.getExtent()
        }));
        if (this.cnns) {
            var subFilters = [];
            for (var i=0,ii=this.cnns.length;i<ii;i++) {
                subFilters.push(new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: 'cnn',
                    value: this.cnns[i]
                }));
            }
            if (subFilters.length > 1) {
                filters.push(new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.OR,
                    filters: subFilters
                }));
            } else {
                filters.push(subFilters[0]);
            }
        }
        featureManager.loadFeatures(
            new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: filters
            })
        );
    },

    /** private: method[initContainer]
     *  Create the primary output container.  All other items will be added to 
     *  this when the group feature store is ready.
     */
    initContainer: function() {

        var intersectionsStore = new Ext.data.JsonStore({
            fields: ['name'],
            root: 'intersections',
            url: "/stub/intersections.json"
        });

        this.container = new Ext.Container(Ext.apply({
            layout: "fit",
            items: [{
                layout: "form",
                bbar: ["->", {text: this.queryActionText, iconCls: "gxp-icon-find", handler: this.performSearch, scope: this}],
                border: false,
                bodyStyle: "padding: 5px",
                items: [{
                    xtype: "fieldset",
                    title: this.attributeLabel,
                    items: [{
                        xtype: "combo",
                        disabled: true,
                        name: 'mechanical_type',
                        fieldLabel: "Mechanical type"
                    }]}, {
                    xtype: "fieldset",
                    title: this.streetLabel,
                    items: [{
                        xtype: "combo",
                        name: "streetname",
                        id: "streetname",
                        fieldLabel: "Street name",
                        emptyText: "Select a street",
                        triggerAction: 'all',
                        listeners: {
                            "select": function(cmb, rec, idx) {
                                intersectionsStore.load({params: {'street': cmb.getValue()}});
                                var cmps = ['start_intersection', 'end_intersection'];
                                for (var i=0,ii=cmps.length; i<ii; i++) {
                                    var cmp = Ext.getCmp(cmps[i]);
                                    cmp.clearValue(); 
                                    cmp.enable();
                                }
                            }
                        },
                        displayField: 'name',
                        store: new Ext.data.JsonStore({
                            fields: ['name'],
                            root: 'streets',
                            url: "/stub/streets.json"
                        })
                    }, {
                        xtype: "combo",
                        id: 'start_intersection',
                        disabled: true,
                        displayField: 'name',
                        triggerAction: 'all',
                        listeners: {
                            "select": this.getCnnList,
                            scope: this
                        },
                        mode: 'local',
                        store: intersectionsStore,
                        name: "start_intersection",
                        fieldLabel: "Starting intersection"
                    }, {
                        xtype: "combo",
                        id: 'end_intersection',
                        disabled: true,
                        displayField: 'name',
                        triggerAction: 'all',
                        listeners: {
                            "select": this.getCnnList,
                            scope: this
                        },
                        mode: 'local',
                        store: intersectionsStore,
                        name: "end_intersection",
                        fieldLabel: "Ending intersection"
                    }]
                }]
            }]
        }, this.outputConfig));
        delete this.outputConfig;
    },

    /** api: method[addOutput]
     */
    addOutput: function() {
        return AsBuilt.Search.superclass.addOutput.call(this, this.container);
    }

});

Ext.preg(AsBuilt.Search.prototype.ptype, AsBuilt.Search);
