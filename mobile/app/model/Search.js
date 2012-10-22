Ext.define('AsBuilt.model.Search', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.identifier.Uuid'],

    config: {
        identifier: 'uuid',
        fields: [
            {name: "id"},
            {name: 'TYPEDESC', type: 'string'},
            {name: 'DOCSUBJECT', type: 'string'},
            {name: 'IDRAWNUM', type: 'string'},
            {name: 'DDRAWDATE', type: 'string'},
            {name: 'SFACILITYNAME', type: 'string'},
            {name: 'SCONTRACTNUM', type: 'string'},
            {name: 'BBOX', type: 'boolean'}  
        ],

        proxy: {
            type: 'localstorage',
            id  : 'search-values'
        }
    }
});
