Ext.define('AsBuilt.model.Note', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'NOTE_ID', type: 'string', mapping: 'fid'},
            {name: 'DOC_ID', type: 'integer', mapping: 'attributes.DOC_ID'},
            {name: 'UPDATED_DT', type: 'datetime', mapping: 'attributes.UPDATED_DT'},
            {name: 'CREATED_BY', type: 'string', mapping: 'attributes.CREATED_BY'},
            {name: 'NOTE', type: 'string', mapping: 'attributes.NOTE'},
            {name: 'ANNOTATION', type: 'string', mapping: 'attributes.ANNOTATION'}
        ]
    }
});
