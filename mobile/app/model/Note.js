Ext.define('AsBuilt.model.Note', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'DOC_ID', type: 'integer', mapping: 'attributes.DOC_ID'},
            {name: 'TIMESTAMP', type: 'datetime', mapping: 'attributes.TIMESTAMP'},
            {name: 'AUTHOR', type: 'string', mapping: 'attributes.AUTHOR'},
            {name: 'NOTE', type: 'string', mapping: 'attributes.NOTE'}
        ]
    }
});
