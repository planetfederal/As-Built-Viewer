Ext.define('AsBuilt.view.Login', {
    extend: 'Ext.form.FormPanel',
    alias: 'widget.login',
    requires: [
        'Ext.field.Text',
        'Ext.form.FieldSet',
        'Ext.field.Password'
    ],
    config: {
        items: [{
            xtype: "fieldset",
            title: 'SFMTA',
            instructions: {
                title: 'As-Built Viewer',
                docked: 'top'
            },
            items: [{
                xtype: 'textfield',
                name: 'username',
                label: "Username"
            }, {
                xtype: 'passwordfield',
                name: 'password',
                label: "Password"
            }, {
                xtype: 'toolbar',
                items: [{
                    xtype: 'spacer',
                    flex: 1
                }, {
                    text: "Login",
                    width: '5em'
                }]
            }]
        }]
    }
});
