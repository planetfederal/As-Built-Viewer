Ext.define('AsBuilt.controller.Search', {
    extend: 'Ext.app.Controller',
    requires: ['AsBuilt.view.Search'],
    config: {
        refs: {
            searchButton: 'button[iconCls="search"]'
        },

        control: {
            searchButton: {
                tap: 'search'
            }
        }

    },

    search: function() {
        var search = Ext.create("AsBuilt.view.Search", {
            width: 400,
            height: 200,
            zIndex: 1000
        });
        search.showBy(this.getSearchButton());
    }

});
