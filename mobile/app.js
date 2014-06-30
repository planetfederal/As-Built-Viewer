Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        GXM: "externals/GXM/src/GXM",
        AsBuilt: "app"
    }
});

Ext.require("AsBuilt.util.Config");

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
    controllers: ['Notes', 'Drawing', 'Search', 'Filter'],

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
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        Ext.Viewport.on("orientationchange", function(vp) {
            Ext.Viewport.down('app_map').getMap().updateSize();
        });

        Ext.Viewport.maximize();
        Ext.Msg.show({
            title: AsBuilt.util.Config.getSecurityTitle(),
            width: '50em',
            cls: 'security-popup',
            zIndex: 1100,
            showAnimation: null,
            hideAnimation: null,
            message: AsBuilt.util.Config.getSecurityMsg(),
            buttons: [Ext.MessageBox.OK],
            promptConfig: false,
            fn: function(){}
        });

        // Get user from sharepoint
        // Initialize the main view
        var url = '/sites/asbuilt/_api/SP.UserProfiles.PeopleManager/GetMyProperties';
        Ext.Ajax.request({
            url: url,
            headers: {
                "accept": "application/json;odata=verbose"
            },
            success: function(response) {
                var data = Ext.decode(response.responseText);
                var userName = data.d.AccountName.split('\\')[1];
                Ext.Viewport.add(Ext.create('AsBuilt.view.Main', {
                    user: userName
                }));
            },
            failure: function() {
                Ext.Msg.show({
                    zIndex: 1000,
                    title: AsBuilt.util.Config.getUserFailedTitle(),
                    showAnimation: null,
                    hideAnimation: null,
                    message: AsBuilt.util.Config.getUserFailedMsg(),
                    buttons: [Ext.MessageBox.OK],
                    promptConfig: false,
                    fn: function() {}
                });
            }
        });
    },

    onUpdated: function() {
        Ext.Msg.show({
            zIndex: 1000,
            title: AsBuilt.util.Config.getUpdateTitle(),
            message: AsBuilt.util.Config.getUpdateMsg(),
            buttons: Ext.MessageBox.YESNO,
            promptConfig: false,
            fn: function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        });
    }
});
