Ext.define("AsBuilt.view.Main", {
    extend: 'Ext.Container',
    xtype: 'main',
    requires: [
        'GXM.FeatureList',
        'AsBuilt.view.Map'
    ],
    config: {
        user: null,
        fullscreen: true,
        layout: 'vbox',
        items: [{
            xtype: 'container',
            layout: 'fit',
            flex: 1,
            items: [{
                xtype: 'toolbar',
                height: 50,
                docked: 'top',
                items: [{
                    xtype: 'container',
                    cls: 'header-container',
                    html: "SFMTA"
                }, {
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
                                        cls: 'logoff',
                                        type: 'logoff',
                                        zIndex: 1000,
                                        items: [{
                                            xtype: 'button',
                                            type: 'user',
                                            ui: 'user',
                                            cls: 'userbutton',
                                            text: "Log Off"
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
                    xtype: 'segmentedbutton',
                    type: 'mapped',
                    hidden: true,
                    defaults: {
                        width: '7em'
                    },
                    items: [{
                        text: 'All'
                    }, {
                        text: 'Mapped'
                    }, {
                        text: 'Unmapped'
                    }]
                }, {
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
            }]
        }, {
            xtype: 'container',
            id: "listcontainer",
            listeners: {
                "painted": function() {
                    var mapPanel = Ext.ComponentQuery.query('app_map')[0];
                    var lyr;
                    for (var i=0, ii=mapPanel.getMap().layers.length; i<ii; ++i) {
                        lyr = mapPanel.getMap().layers[i];
                        if (lyr instanceof OpenLayers.Layer.Vector && lyr.protocol) {
                            break;
                        }
                    }
                    var featureList = Ext.Viewport.down("gxm_featurelist");
                    if (!featureList) {
                        this.add(Ext.create("GXM.FeatureList", {
                            layer: lyr,
                            listeners: {
                                'itemtap': function(list, idx, target, record) {
                                    // TODO centralize this code, is also in view/Map.js
                                    var f = record.getFeature();
                                    var drawing = Ext.create('AsBuilt.view.Drawing', {
                                        fid: f.fid,
                                        attributes: f.attributes
                                    });
                                    var search = Ext.Viewport.down('app_search');
                                    if (search) {
                                        search.hide();
                                    }
                                    Ext.Viewport.add(drawing);
                                    Ext.Viewport.setActiveItem(drawing);
                                }
                            },
                            itemTpl: new Ext.XTemplate('<tpl if="feature.attributes.SDRAWTITLE != null">{feature.attributes.SDRAWTITLE}<tpl else>Title unknown</tpl> | <tpl if="feature.attributes.TYPEDESC != null">{feature.attributes.TYPEDESC}<tpl else>Type unknown</tpl> | <tpl if="feature.attributes.DDRAWDATE != null">{feature.attributes.DDRAWDATE}<tpl else>Date unknown</tpl>')
                        }));
                    }
                }
            },
            layout: "fit",
            items: [{
                xtype: 'toolbar', 
                docked: 'top', 
                type: 'featurelist', 
                ui: 'maxfeatures', 
                hidden: true, 
                items: [{
                    xtype: 'container', 
                    cls: 'maxfeatures', 
                    width: '100%'
                }]
            }],
            height: 250
        }]
    }
});
