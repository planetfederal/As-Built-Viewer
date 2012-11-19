Ext.define('AsBuilt.view.AutoComplete', {
    extend: 'Ext.field.Text',
    xtype: 'app_autocompletefield',
    requires: [
        "AsBuilt.util.Config",
        "Ext.data.Store",
        "GXM.data.proxy.Protocol",
        "Ext.util.DelayedTask",
        'Ext.data.reader.Json'
    ],
    config: {
        featureType: null,
        store: null,
        maxFeatures: 50,
        minChars: 1,
        defaultTabletPickerConfig: {
            zIndex: 1051
        }
    },

    getTabletPicker: function() {
        var config = this.getDefaultTabletPickerConfig();

        var store = this.getStore();
        var newStore = [];
        var name = this.getName();
        store.each(function(record) {
            Ext.Array.include(newStore, record.data[name]);
        });

        if (!this.listPanel) {
            this.listPanel = Ext.create('Ext.Panel', Ext.apply({
                left: 0,
                top: 0,
                modal: true,
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                width: Ext.os.is.Phone ? '14em' : '18em',
                height: Ext.os.is.Phone ? '12.5em' : '22em',
                items: {
                    xtype: 'list',
                    store: newStore,
                    itemTpl: '<span class="x-list-label">{field1:htmlEncode}</span>',
                    listeners: {
                        select : this.onListSelect,
                        itemtap: this.onListTap,
                        scope  : this
                    }
                }
            }, config));
        }
        return this.listPanel;
    },

    onListSelect: function(item, record) {
        var me = this;
        if (record) {
            me.setValue(record.get('field1'));
        }
    },

    onListTap: function() {
        this.listPanel.hide({
            type : 'fade',
            out  : true,
            scope: this
        });
    },

    showPicker: function() {
        var store = this.getStore(), name = this.getName();
        //check if the store is empty, if it is, return
        if (!store || store.getCount() === 0) {
            return;
        }
        if (this.getReadOnly()) {
            return;
        }
        this.isFocused = true;

        var listPanel = this.getTabletPicker(),
            list = listPanel.down('list'),
            index, record;

        if (!listPanel.getParent()) {
            Ext.Viewport.add(listPanel);
        }

        listPanel.showBy(this.getComponent());
    },

    initialize: function() {
        var modelName = this.getFeatureType() + "_" + this.getName();
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            config: {
                fields: [
                    {name: this.getName(), type: "string", mapping: 'attributes.' + this.getName()}
                ]
            }
        });
        this.setStore(Ext.create("Ext.data.JsonStore", {
            model: modelName,
            proxy: {
                type: "gxm_protocol",
                setParamsAsOptions: true,
                protocol: new OpenLayers.Protocol.WFS({
                    version: "1.1.0",
                    url: AsBuilt.util.Config.getGeoserverUrl(),
                    featureType: this.getFeatureType(),
                    featureNS: AsBuilt.util.Config.getFeatureNS(),
                    propertyNames: [this.getName()],
                    maxFeatures: this.getMaxFeatures(),
                    outputFormat: 'json',
                    readFormat: new OpenLayers.Format.GeoJSON()
                }),
                reader: 'json'
            }
        }));
        var task = Ext.create('Ext.util.DelayedTask', this.keyUp, this);
        this.on("keyup", function() { 
            task.delay(500); 
        }, this);
        this.callParent();
    },

    keyUp: function() {
        if (this.getValue().length >= this.getMinChars()) {
            var value = '*' + this.getValue() + '*';
            var filter = new OpenLayers.Filter.Comparison({
                property: this.getName(),
                type: '~',
                matchCase: false,
                value: value
            });
            this.getStore().on('load', this.showPicker, this, {single: true});
            this.getStore().load({filter: filter});
        }
    }

});
