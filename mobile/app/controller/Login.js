Ext.define('AsBuilt.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: ['AsBuilt.model.User'],
    config: {
        refs: {
            main: 'main',
            login: 'login',
            loginButton: 'button[text="Login"]'
        },

        control: {
            loginButton: {
                tap: 'login'
            }
        }

    },

    login: function() {
        var values = this.getLogin().getValues();
        var user = Ext.create('AsBuilt.model.User', values);
        var errors = user.validate();
        if (errors.isValid()) {
            var main = this.getMain();
            if (!main) {
                main = Ext.create('AsBuilt.view.Main', {
                    user: values['username']
                });
            }
            Ext.Viewport.setActiveItem(main);
        } else {
            var message = '';
            Ext.each(errors.items,function(rec,i){
                message += rec._field + " " + rec._message+"<br>";
            });
            Ext.Msg.show({
                zIndex: 1000,
                showAnimation: null,
                hideAnimation: null,
                message: message,
                buttons: [{text: 'OK'}],
                promptConfig: false,
                fn: function(){}
            });
        }
    }

});
