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
            }, {
                xtype: 'toolbar',
                height: 50,
                docked: 'bottom',
                items: [{
                    xtype: 'spacer',
                    flex: 1
                }, {
                    xtype: 'button',
                    text: 'Search'
                }]
            }
        ]
    }
});
