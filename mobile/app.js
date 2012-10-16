Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        GXM: "externals/GXM/lib/GXM",
        AsBuilt: "app"
    }
});

Ext.require('AsBuilt.util.Config');

Ext.application({
    name: 'AsBuilt',

    requires: [
        'Ext.MessageBox'
    ],

    viewport: {
        autoMaximize: true
    },

    views: ['Main'],
    stores: ['Notes', 'Search'],
    controllers: ['Notes', 'Drawing', 'Search'],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        // TODO I don't see another way currently to get out of ST2 zIndex mess
        // then to do this override, revisit when upgrading ST
        Ext.Container.override({
            updateZIndex: function(zIndex) {
                // added code:
                if (this.config && this.config.zIndex) {
                    zIndex = this.config.zIndex;
                }
                // original code:
                var domStyle = this.element.dom.style;

                if (zIndex !== null) {
                    domStyle.setProperty('z-index', zIndex, 'important');
                }
                else {
                    domStyle.removeProperty('z-index');
                }
            }
        });
        // end of TODO
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('AsBuilt.view.Main'));
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
