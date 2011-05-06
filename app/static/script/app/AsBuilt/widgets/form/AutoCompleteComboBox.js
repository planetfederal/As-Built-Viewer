/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @include AsBuilt/data/AutoCompleteReader.js
 * @include AsBuilt/data/AutoCompleteProxy.js
 */

/** api: (define)
 *  module = AsBuilt.form
 *  class = AutoCompleteComboBox
 *  base_link = `Ext.form.ComboBox <http://extjs.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */
Ext.namespace("AsBuilt.form");

/** api: constructor
 *  .. class:: AutoCompleteComboBox(config)
 *
 *  Creates an autocomplete combo box that issues queries to a WFS typename.
 *
 */
AsBuilt.form.AutoCompleteComboBox = Ext.extend(Ext.form.ComboBox, {

    /** api: xtype = app_autocompletecombo */
    xtype: "app_autocompletecombo",

    id: null,

    featureType: null,

    featurePrefix: null,

    fieldLabel: null,

    geometryName: null,

    maxFeatures: 500,

    url: null,

    autoHeight: true,

    hideTrigger: true,

    srsName: null,

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {
        var fields = [{name: this.id}];
        var propertyNames = [this.id];
        if (this.geometryName !== null) {
            fields.push({name: this.geometryName});
            propertyNames.push(this.geometryName);
        }
        this.name = this.valueField = this.displayField = this.id;
        this.tpl = new Ext.XTemplate('<tpl for="."><div class="x-form-field">','{'+this.name+'}','</div></tpl>');
        this.itemSelector = 'div.x-form-field';
        this.store = new Ext.data.Store({
            fields: fields,
            reader: new AsBuilt.data.AutoCompleteReader({uniqueField: this.id}, propertyNames),
            proxy: new AsBuilt.data.AutoCompleteProxy({protocol: new OpenLayers.Protocol.WFS({
                version: "1.1.0",
                url: this.url,
                featureType: this.featureType,
                featurePrefix: this.featurePrefix,
                srsName: this.srsName,
                propertyNames: propertyNames,
                maxFeatures: this.maxFeatures
            }), setParamsAsOptions: true})
        });
        return AsBuilt.form.AutoCompleteComboBox.superclass.initComponent.apply(this, arguments);
    }

});

Ext.reg(AsBuilt.form.AutoCompleteComboBox.prototype.xtype, AsBuilt.form.AutoCompleteComboBox);
