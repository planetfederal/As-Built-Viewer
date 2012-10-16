Ext.define('AsBuilt.model.Search', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.identifier.Uuid'],

    config: {
        identifier: 'uuid',
        fields: [
            {name: "id"},
            {name: 'TYPEDESC', type: 'string'},
            {name: 'DOCSUBJECT', type: 'string'}
        ],

        proxy: {
            type: 'localstorage',
            id  : 'search-values'
        }
    }
});
