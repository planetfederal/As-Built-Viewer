Ext.define('AsBuilt.controller.Notes', {
    requires: ['Ext.dataview.List'],
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            list: 'list',
            notesButton: 'button[title="Notes"]'
        },

        control: {
            notesButton: {
                tap: 'showNotes'
            }
        }

    },

    showNotes: function() {
        if (!this.getList()) {
            var list = Ext.create("Ext.dataview.List", {
                xtype: 'list',
                width: 400,
                height: 200,
                itemTpl: new Ext.XTemplate('<div class="notesNote">{NOTE}</div><div class="notesAuthor">Added {TIMESTAMP:this.formatTS} by {AUTHOR}</div>', {
                    formatTS: function(value) {
                        if (value !== null) {
                            return Ext.Date.format(Ext.Date.parse(value, 'c'), 'F j, Y, g:i a');                           
                        } else {
                            return "";
                        }
                    }
                }),
                store: Ext.getStore('Notes')
            });
            list.showBy(this.getNotesButton());
        } else {
            if (this.getList().getHidden()) {
                this.getList().show();
            } else {
                this.getList().hide();
            }
        }
    }

});
