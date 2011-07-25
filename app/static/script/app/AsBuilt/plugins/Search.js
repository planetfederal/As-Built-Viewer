/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

Ext.ns("AsBuilt.plugins");

// better sorting for streets store so that 2nd street comes before 10th street
Ext.override(Ext.data.Store, {

    createSortFunction: function(field, direction) {
        direction = direction || "ASC";
        var directionModifier = direction.toUpperCase() == "DESC" ? -1 : 1;

        var sortType = this.fields.get(field).sortType;

        //create a comparison function. Takes 2 records, returns 1 if record 1 is greater,
        //-1 if record 2 is greater or 0 if they are equal
        return function(r1, r2) {
            var v1 = sortType(r1.data[field]),
                v2 = sortType(r2.data[field]);

            var i1 = parseInt(v1, 10);
            if (isNaN(i1) === false) {
                var i2 = parseInt(v2, 10);
                var result = (i1 > i2) ? 1 : (i1 < i2) ? -1 : 0;
                if (result !== 0) {
                   return directionModifier * result;
                }
            }
            return directionModifier * (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
        };
    }

});

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
    queryActionTooltip: "Query the dataset taking into account the filters above",
    documentTypeEmpty: "Select a type",
    clearActionText: "Clear",
    clearActionTooltip: "Clear the previous selection",
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
                    value: '*' + " " + this.cnns[i] + "," + '*'
                }));
            }
            if (subFilters.length > 1) {
                filters.push(new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.OR,
                    filters: subFilters
                }));
            } else if (subFilters[0] !== undefined) {
                filters.push(subFilters[0]);
            }
        }
        if (filters.length > 1) {
            featureManager.loadFeatures(
                new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.AND,
                    filters: filters
                }));
        } else if (filters[0] !== undefined) {
            featureManager.loadFeatures(filters[0]);
        } else {
            featureManager.loadFeatures();
        }
    },

    getButtonConfig: function() {
        return [{
            text: this.queryActionText,
            tooltip: {title: this.queryActionText, text: this.queryActionTooltip},
            iconCls: "gxp-icon-find",
            handler: this.performSearch,
            scope: this
        }, {
            text: this.clearActionText,
            tooltip: {title: this.clearActionText, text: this.clearActionTooltip},
            handler: function() {
                var featureManager = this.target.tools[this.featureManager];
                featureManager.clearFeatures();
                this.cnns = [];
                Ext.getCmp('searchform').getForm().reset();
            },
            scope: this
        }];
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
                border: false,
                bodyStyle: "padding: 5px",
                items: [
				{
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
                                    // clear cnn list
                                    this.cnns = [];
                                    intersectionsStore.on('load', function() { 
                                        intersectionsStore.filter('street', cmb.getValue());
                                    });
                                    if (intersectionsStore.getCount() === 0) {
                                        intersectionsStore.load();
                                    } else {
                                        intersectionsStore.filter('street', cmb.getValue());
                                    }
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
                            mode: "local",
                            forceSelection: true,
                            typeAhead: true,
                            store: new Ext.data.JsonStore({
                                fields: ['street_name', 'street_id'],
                                root: 'streets',
                                autoLoad: true,
                                sortInfo: {
                                    field: 'street_name'
                                },
                                url: this.streetsURL
                            })
                        }, {
                            xtype: "combo",
                            id: 'start_intersection',
                            editable: false,
                            store: intersectionsStore,
                            disabled: true,
                            lastQuery: '',
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
                            editable: false,
                            store: intersectionsStore,
                            disabled: true,
                            lastQuery: '',
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
                        }]
                    }, {
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
                                minChars: 1,
                                featureType: "VW_SFACILITYNAME", /* TODO make configurable */
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
                                minChars: 1,
                                featureType: "VW_SCONTRACTTITLE", /* TODO make configurable */
                                featurePrefix: featureInfo[0],
                                fieldLabel: this.contractTitleLabel
                            }
                        ]
                    }
                ], buttons: this.getButtonConfig()
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
