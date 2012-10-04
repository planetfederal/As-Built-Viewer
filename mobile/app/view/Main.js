Ext.define("AsBuilt.view.Main", {
    extend: 'Ext.Container',
    requires: [
        'AsBuilt.view.Map'
    ],
    config: {
        layout: 'fit',
        items: [
            {
                xtype: 'app_map'
            }
        ]
    }
});
