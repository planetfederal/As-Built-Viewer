Ext.define("AsBuilt.view.Main", {
    extend: 'Ext.Container',
    xtype: 'main',
    requires: [
        'AsBuilt.view.Map'
    ],
    config: {
        user: null,
        fullscreen: true,
        layout: 'fit',
        items: [
            {
                xtype: 'toolbar',
                height: 50,
                docked: 'top',
                items: [{
                    xtype: 'container',
                    cls: 'title-container',
                    html: "As-Built Viewer"
                }, {
                    xtype: "spacer",
                    flex: 1
                }, {
                    xtype: 'button',
                    type: 'user'
                }]
            }, {
                xtype: 'app_map'
            }, {
                xtype: 'toolbar',
                height: 50,
                docked: 'bottom',
                items: [{
                    xtype: 'spacer',
                    flex: 1
                }, {
                    iconMask: 'true',
                    iconCls: 'search'
                }, {
                    text: 'Cancel',
                    hidden: true
                }, {
                    text: 'Reset',
                    hidden: true
                }, {
                    text: 'Modify Search',
                    hidden: true
                }]
            }
        ]
    }
});
