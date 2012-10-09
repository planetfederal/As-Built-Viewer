Ext.define('AsBuilt.model.Note', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'DOC_ID', type: 'integer'},
            {name: 'TIMESTAMP', type: 'datetime'},
            {name: 'AUTHOR', type: 'string'},
            {name: 'NOTE', type: 'string'}
        ]
    }
});
