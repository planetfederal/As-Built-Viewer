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
        // TODO I don't see another way currently to get out of ST2 zIndex mess
        // then to do this override, revisit when upgrading ST
        Ext.Component.override({
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

        Ext.Viewport.on("orientationchange", function(vp) {
            Ext.Viewport.down('app_map').getMap().updateSize();
        });

        Ext.Viewport.maximize();
        var msg = "WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520.  No part of this record may be disclosed to persons without a 'need to know,' as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation.  Unauthorized release may result in civil penalty or other action.<br/>SFMTA As-Built Design Documents are 'Security Sensitive Information' or 'SSI Documents' and are confidential and protected from public disclosure under federal law, as noted above.<br/>The disclosure of SSI documents to unauthorized persons may cause irreparable damage to the SFMTA, and may threaten or compromise the security of the traveling public, transit employees, or transit infrastructure.<br/>By accessing this program you acknowledge that the disclosure to the public of any documents identified as SSI is against federal law and you agree to abide by the restrictions against disclosure of such documents.</br>Please refer to the SFMTA Statement of Incompatible Activities for more detail regarding prohibited conduct.  Inappropriate use of SFMTA resources may result in discipline, up to and including termination of employment.<br/>For more information, please review the SFMTA Technology Resources Policy available under the Quick Links > IT Support Team tabs on the SFMTA Intranet page.  Continuing means you accept the above conditions.  Press OK when ready.";
        Ext.Msg.show({
            title: ' SENSITIVE SECURITY INFORMATION',
            width: '50em',
            cls: 'security-popup',
            zIndex: 1000,
            showAnimation: null,
            hideAnimation: null,
            message: msg,
            buttons: [{text: 'OK'}],
            promptConfig: false,
            fn: function(){}
        });

        // Initialize the main view
        // TODO: detect user from SharePoint
        Ext.Viewport.add(Ext.create('AsBuilt.view.Main', {
            user: 'Dummy User'
        }));
    },

    onUpdated: function() {
        Ext.Msg.show({
            zIndex: 1000,
            title: "Application Update",
            message: "This application has just successfully been updated to the latest version. Reload now?",
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
