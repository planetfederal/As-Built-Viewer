Ext.define('AsBuilt.controller.Notes', {
    requires: ['Ext.dataview.List'],
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            notesButton: 'button[title="Notes"]'
        },

        control: {
            notesButton: {
                tap: 'showNotes'
            }
        }

    },

    showNotes: function() {
        if (!this.list) {
            this.list = Ext.create('Ext.dataview.List', {
                width: 200,
                height: 200,
                right: 10,
                bottom: 10,
                itemTpl: '<div>{NOTE}</div>',
                store: Ext.getStore('Notes')
            });
            Ext.Viewport.add(this.list);
        }
    }

});
