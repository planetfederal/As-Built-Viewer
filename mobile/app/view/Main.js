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
                    xtype: 'container',
                    cls: 'user-container',
                    listeners: {
                        tap: {
                            /* TODO could not find a good way to do this in a controller */
                            fn: function() {
                                var panel = Ext.ComponentQuery.query('panel[type="logoff"]')[0];
                                if (!panel) {
                                    panel = Ext.create('Ext.Panel', {
                                        width: 150,
                                        height: 75,
                                        type: 'logoff',
                                        zIndex: 1000,
                                        items: [{
                                            xtype: 'button',
                                            type: 'user',
                                            cls: 'userbutton',
                                            text: "Log off"
                                        }]
                                    });
                                    panel.showBy(this);
                                } else {
                                    if (panel.getHidden()) {
                                        panel.show();
                                    } else {
                                        panel.hide();
                                    }
                                }
                            },
                            element: 'element'
                        }
                    },
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
