Ext.define('AsBuilt.view.Search', {
    extend: 'Ext.form.Panel',
    requires: [
        'AsBuilt.view.AutoComplete',
        'Ext.form.FieldSet', 
        'Ext.field.Select', 
        'Ext.field.Text'
    ],
    xtype: 'app_search',

    config: {
        scrollable: false,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            layout: 'vbox',
            margin: '0em 0.3em 0em 0em'
        },
        defaultType: 'container',
        items: [{
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
                        text: 'All types',
                        value: ''
                    }, {
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
                }, {
                    xtype: 'textfield',
                    label: 'Number',
                    name: 'IDRAWNUM'
                }, {
                    xtype: 'textfield',
                    label: 'Date',
                    name: 'DDRAWDATE'
                }]
            }] 
        }, {
            items: [{
                xtype: 'fieldset',
                title: 'Facility',
                items: [{
                    xtype: 'app_autocompletefield',
                    featureType: "VW_SFACILITYNAME",
                    label: 'Name',
                    name: 'SFACILITYNAME'
                }]
            }, {
                xtype: 'fieldset',
                title: 'Contract',
                items: [{
                    xtype: 'textfield',
                    label: 'Number',
                    name: 'SCONTRACTNUM'
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xtype: 'checkboxfield',
                    label: 'Use map extent',
                    height: 40,
                    labelWidth: '70%',
                    name: "BBOX"
                }]
            }]
        }, {
            xtype: 'toolbar',
            margin: 0,
            height: 50,
            docked: 'bottom',
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
