Ext.define('AsBuilt.store.Search', {
    extend  : 'Ext.data.Store',
    requires: ['AsBuilt.model.Search'],
    config: {
        autoLoad: true,
        model: 'AsBuilt.model.Search'
    }
});
