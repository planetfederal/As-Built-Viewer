Ext.define('AsBuilt.view.Search', {
    extend: 'Ext.form.Panel',
    requires: ['Ext.form.FieldSet', 'Ext.field.Select', 'Ext.field.Text'],
    xtype: 'app_search',

    config: {
        items: [{
            xtype: 'fieldset',
            title: 'Drawing',
            items: [{
                xtype: 'selectfield',
                name: 'TYPEDESC',
                defaultTabletPickerConfig: {
                    zIndex: 1051
                },
                label: 'Type',
                value: "",
                options: [{
                    text: 'MUNI Drawings Numbered Plans (MDNP)', 
                    value: 'MUNI Drawings Numbered Plans (MDNP)'
                }, {
                    text: 'UnClassified Scans',
                    value: 'UnClassified Scans'
                }, {
                    text: 'MUNI SHOP Drawings (MUSH)',
                    value: 'MUNI SHOP Drawings (MUSH)'
                }, {
                    text: 'MUNI BART Drawings (MUBA)',
                    value: 'MUNI BART Drawings (MUBA)'
                }, {
                    text: 'BOE Numbered Plans',
                    value: 'BOE Numbered Plans'
                }]
            }, {
                xtype: 'textfield',
                label: 'Subject',
                name: 'DOCSUBJECT'
            }]
        }, {
            xtype: 'toolbar',
            height: 50,
            items: [{
                xtype: 'spacer',
                flex: 1
            }, {
                xtype: 'button',
                text: "Search"
            }, {
                xtype: 'spacer',
                flex: 1
            }]
        }]
    }
});
