Ext.define('AsBuilt.controller.Login', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            loginButton: 'button[text="Login"]'
        },

        control: {
            loginButton: {
                tap: 'login'
            }
        }

    },

    login: function() {
        var main = this.getMain();
        if (!main) {
            main = Ext.create('AsBuilt.view.Main');
        }
        Ext.Viewport.setActiveItem(main);
    }

});
