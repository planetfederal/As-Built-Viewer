Ext.define('AsBuilt.model.User', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'username', type: 'string'},
            {name: 'password', type: 'string'}
        ],
        validations: [{
            type: 'presence',
            field: 'username'
        }, {
            type: 'presence',
            field: 'password'
        }]
    }
});

