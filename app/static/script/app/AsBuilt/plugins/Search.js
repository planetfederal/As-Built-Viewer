/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

Ext.ns("AsBuilt.plugins");

/** api: (define)
 *  module = AsBuilt.plugins
 *  class = Search
 *  extends = gxp.plugins.Tool
 */

/** api: constructor
 *  .. class:: Search(config)
 *
 *    Search for images.
 */
AsBuilt.plugins.Search = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_search */
    ptype: "app_search",

    /** api: config[featureManager]
     *  ``String`` The id of the :class:`gxp.plugins.FeatureManager` to use
     *  with this tool.
     */
    featureManager: null,

    /** api: config[streetsURL]
     *  ``String`` URL where the JSON with the list of streets can be found.
     */
    streetsURL: "json/streets.json",

    /** api: config[intersectionsURL]
     *  ``String`` URL where the JSON with the list of intersections can be 
     *      found.
     */
    intersectionsURL: "json/intersections.json",

    /** api: config[cnnURL]
     *  ``String`` URL where the JSON with the list of CNNs
     *      can be found.
     */
    cnnURL: "json/cnn.json",

    /** api: config [typeDescriptionSearchField]
     *  ``String`` The search field to use for drawing type description.
     */
    typeDescriptionSearchField: 'TYPEDESC',

    /** api: config [documentSubjectSearchField]
     *  ``String`` The search field to use for document subject.
     */
    documentSubjectSearchField: 'DOCSUBJECT',

    /** api: config [fileNumberSearchField]
     *  ``String`` The search field to use for file number.
     */
    fileNumberSearchField: 'FILENO',

    /** api: config [facilitySearchField]
     *  ``String`` The search field to use for facilility.
     */
    facilitySearchField: 'SFACILITYNAME',

    /** api: config [contractSearchField]
     *  ``String`` The search field to use for contract.
     */
    contractSearchField: 'SCONTRACTTITLE',

    /** api: config [cnnField]
     *  ``String`` The field containing CNN information.
     */
    cnnField: 'CNNLIST',

    /* i18n start */
    drawingLabel: "Drawing Number",
    streetLabel: "Street location",
    mapExtentLabel: "Map extent",
    mapExtentCheckbox: "Use map extent",
    queryActionText: "Query",
    documentTypeEmpty: "Select a type",
    documentTypeLabel: "Document type",
    documentSubjectLabel: "General Subject",
    fileNumberLabel: "File Number",
    facilityNameLabel: "Facility name",
    contractTitleLabel: "Contract title",
    streetNameLabel: "Street name",
    streetNameEmpty: "Select a street",
    startIntersectionLabel: "Starting intersection",
    endIntersectionLabel: "Ending intersection",
    /* i18n end */

    /** private: cnns
     * ``Array(String)`` List of center network node identifiers
     * to use in the search.
     */
    cnns: null,

    /** api: method[init]
     *  :arg target: ``gxp.Viewer``
     *  Initialize the search plugin.
     */
    init: function(target) {
        AsBuilt.plugins.Search.superclass.init.apply(this, arguments);
        Ext.USE_NATIVE_JSON = true;
        this.initContainer();
    },

    /** api: method[addActions]
     *  :arg actions: ``Array`` Optional actions to add. If not provided,
     *      this.actions will be added.
     *  :returns: ``Array`` The actions added.
     */
    addActions: function(config) {
        this.addOutput();
        return AsBuilt.plugins.Search.superclass.addActions.call(this, []);
    },

    /** private: method[getCnnList]
     *
     *  Get the list of CNN values to use. This is looked up in a JSON file.
     */
    getCnnList: function() {
        if (!this.cnnStore) {
            this.cnnStore = new Ext.data.JsonStore({
                autoLoad: true,
                fields: ['intersection_id', 'cnn_list'],
                root: 'cnn',
                url: this.cnnURL
            });
        }
        var start = Ext.getCmp('start_intersection').getValue();
        var end = Ext.getCmp('end_intersection').getValue();
        if (start !== "" && end !== "") {
            this.cnns = [];
            // take all cnn from minIndex to maxIndex - 1
            var minIndex = Math.min(start, end);
            var maxIndex = Math.max(start, end);
            this.cnnStore.filter({
                fn: function(record) {
                    var idx = parseInt(record.get("intersection_id"), 10);
                    return (idx >= minIndex && idx < maxIndex);
                },
                scope: this
            });
            this.cnnStore.each(function(record) {
                var cnn = record.get("cnn_list");
                var cnns = cnn.split(",");
                // remove duplicates
                for (var i=0,ii=cnns.length; i<ii; ++i) {
                    var value = cnns[i];
                    if (this.cnns.indexOf(value) === -1) {
                        this.cnns.push(Ext.util.Format.trim(value));
                    }
                }
            }, this);
        }
    },

    /** private: method[getFilter]
     *  :arg name: ``String`` Field name to create the filter for. 
     *  :returns: ``OpenLayers.Filter.Comparison`` The filter created
     *      for the field specified.
     *
     *  Get the filter for a certain form field.
     */
    getFilter: function(name) {
        var value = Ext.getCmp('searchform').getForm().findField(name).getValue();
        if (value !== "") {
            return new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.LIKE,
                matchCase: false,
                property: name,
                value: '*' + value + '*'
            });
        }
        return null;
    },

    /** private: method[performSearch]
     *
     *  Build up the request and load up the data through the FeatureManager.
     */
    performSearch: function() {
        var featureManager = this.target.tools[this.featureManager];
        var filters = [];
        var i = null, ii = null;
        var fields = [
            this.typeDescriptionSearchField, 
            this.contractSearchField, 
            this.facilitySearchField, 
            this.documentSubjectSearchField, 
            this.fileNumberSearchField
        ];
        for (i=0,ii=fields.length;i<ii;++i) {
            var filter = this.getFilter(fields[i]);
            if (filter !== null) {
                filters.push(filter);
            }
        }
        var mapextent = Ext.getCmp("mapextent");
        if (mapextent.getValue() === true) {
            filters.push(new OpenLayers.Filter.Spatial({
                type: OpenLayers.Filter.Spatial.BBOX,
                property: featureManager.featureStore.geometryName,
                value: this.target.mapPanel.map.getExtent()
            }));
        }
        if (this.cnns) {
            var subFilters = [];
            for (i=0,ii=this.cnns.length;i<ii;i++) {
                subFilters.push(new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LIKE,
                    property: this.cnnField,
                    value: '*' + this.cnns[i] + '*'
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
     *  Create the primary output container.
     */
    initContainer: function() {
        var intersectionsStore = new Ext.data.JsonStore({
            fields: ['street', 'cross_street', 'intersection_id'],
            root: 'intersections',
            url: this.intersectionsURL
        });
        var types = [
            ['MUNI Drawings Numbered Plans (MDNP)'], 
            ['UnClassified Scans'],
            ['MUNI SHOP Drawings (MUSH)'],
            ['MUNI BART Drawings (MUBA)'],
            ['BOE Numbered Plans']
        ];
        var typeDescStore = new Ext.data.ArrayStore({
            fields: ['type'],
            data : types
        });
        var featureManager = this.target.tools[this.featureManager];
        var url = this.target.initialConfig.sources[featureManager.layer.source].url;
        var featureInfo = featureManager.layer.name.split(":");
        this.container = new Ext.Container(Ext.apply({
            layout: "fit",
            items: [{
                xtype: "form",
                id: "searchform",
                autoScroll: true,
                bbar: [{
                    text: this.queryActionText, 
                    iconCls: "gxp-icon-find", 
                    handler: this.performSearch, 
                    scope: this
                }],
                border: false,
                bodyStyle: "padding: 5px",
                items: [
                    {
                        xtype: "fieldset",
                        title: this.mapExtentLabel,
                        items: [
                            {
                                xtype: "checkbox",
                                id: "mapextent",
                                name: "mapextent",
                                fieldLabel: this.mapExtentCheckbox
                            }
                        ]
                    }, {
                        xtype: "fieldset",
                        title: this.drawingLabel,
                        items: [
                            {
                                xtype: "combo",
                                name: this.typeDescriptionSearchField,
                                mode: 'local',
                                emptyText: this.documentTypeEmpty,
                                triggerAction: 'all',
                                store: typeDescStore,
                                displayField: 'type',
                                valueField: 'type',
                                fieldLabel: this.documentTypeLabel
                            }, {
                                xtype: "gxp_autocompletecombo",
                                fieldName: this.documentSubjectSearchField,
                                url: url,
                                featureType: featureInfo[1],
                                featurePrefix: featureInfo[0],
                                fieldLabel: this.documentSubjectLabel
                            }, {
                                xtype: "gxp_autocompletecombo",
                                fieldName: this.fileNumberSearchField,
                                url: url,
                                featureType: featureInfo[1],
                                featurePrefix: featureInfo[0],
                                fieldLabel: this.fileNumberLabel
                            }
                        ]
                    }, {
                        xtype: "fieldset",
                        title: "Facilities",
                        items: [
                            {
                                xtype: "gxp_autocompletecombo",
                                fieldName: this.facilitySearchField,
                                url: url,
                                featureType: featureInfo[1],
                                featurePrefix: featureInfo[0],
                                fieldLabel: this.facilityNameLabel
                            }
                        ]
                    }, {
                        xtype: "fieldset",
                        title: "Contracts",
                        items: [
                            {
                                xtype: "gxp_autocompletecombo",
                                fieldName: this.contractSearchField,
                                url: url,
                                featureType: featureInfo[1],
                                featurePrefix: featureInfo[0],
                                fieldLabel: this.contractTitleLabel
                            }
                        ]
                    }, {
                        xtype: "fieldset",
                        title: this.streetLabel,
                        items: [
                            {
                                xtype: "combo",
                                name: "streetname",
                                id: "streetname",
                                fieldLabel: this.streetNameLabel,
                                emptyText: this.streetNameEmpty,
                                triggerAction: 'all',
                                listeners: {
                                    "select": function(cmb, rec, idx) {
                                        if (intersectionsStore.getCount() === 0) {
                                            intersectionsStore.load();
                                        }
                                        intersectionsStore.filter('street', cmb.getValue());
                                        var cmps = ['start_intersection', 'end_intersection'];
                                        for (var i=0,ii=cmps.length; i<ii; i++) {
                                            var cmp = Ext.getCmp(cmps[i]);
                                            cmp.clearValue();
                                            cmp.enable();
                                        }
                                    },
                                    scope: this
                                },
                                displayField: 'street_name',
                                valueField: 'street_name',
                                store: new Ext.data.JsonStore({
                                    fields: ['street_name', 'street_id'],
                                    root: 'streets',
                                    url: this.streetsURL
                                })
                            }, {
                                xtype: "combo",
                                id: 'start_intersection',
                                store: intersectionsStore,
                                disabled: true,
                                displayField: 'cross_street',
                                valueField: "intersection_id",
                                triggerAction: 'all',
                                listeners: {
                                    "select": this.getCnnList,
                                    scope: this
                                },
                                mode: 'local',
                                name: "start_intersection",
                                fieldLabel: this.startIntersectionLabel
                            }, {
                                xtype: "combo",
                                id: 'end_intersection',
                                store: intersectionsStore,
                                disabled: true,
                                displayField: 'cross_street',
                                valueField: "intersection_id",
                                triggerAction: 'all',
                                listeners: {
                                    "select": this.getCnnList,
                                    scope: this
                                },
                                mode: 'local',
                                name: "end_intersection",
                                fieldLabel: this.endIntersectionLabel
                            }
                        ]
                    }
                ]
            }]
        }, this.outputConfig));
        delete this.outputConfig;
    },

    /** api: method[addOutput]
     */
    addOutput: function() {
        return AsBuilt.plugins.Search.superclass.addOutput.call(this, this.container);
    }

});

Ext.preg(AsBuilt.plugins.Search.prototype.ptype, AsBuilt.plugins.Search);
