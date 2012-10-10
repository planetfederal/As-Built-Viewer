Ext.define('AsBuilt.view.Search', {
    extend: 'Ext.form.Panel',
    requires: ['Ext.field.Select'],
    xtype: 'app_search',

    config: {
        items: [{
            xtype: 'selectfield',
            label: 'Type',
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
        }]
    }
});
