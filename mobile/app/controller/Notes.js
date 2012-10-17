Ext.define('AsBuilt.controller.Notes', {
    requires: ['Ext.dataview.List'],
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            list: 'panel[type="notes"]',
            details: 'app_drawingdetails',
            notesButton: 'button[title="Notes"]'
        },

        control: {
            notesButton: {
                tap: 'showNotes'
            }
        }

    },

    showNotes: function() {
        if (this.getDetails()) {
            this.getDetails().hide();
        }
        var lst = this.getList();
        if (!lst) {
            var list = Ext.create("Ext.Panel", {
                width: 400,
                height: 200,
                zIndex: 1000,
                layout: 'fit',
                type: 'notes',
                items: [{
                    xtype: 'list',
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
                }, {
                    xtype: 'container',
                    cls: 'addnote',
                    height: 50,
                    docked: 'bottom',
                    layout: 'hbox',
                    items: [{
                        xtype: 'textfield',
                        flex: 1,
                        placeHolder: 'Enter Note'
                    }, {
                        xtype: 'button',
                        cls: 'addnotebutton',
                        width: 75,
                        height: 40,
                        text: "Add"
                    }]
                }]
            });
            list.showBy(this.getNotesButton());
        } else {
            if (lst.getHidden()) {
                lst.show();
            } else {
                lst.hide();
            }
        }
    }

});
