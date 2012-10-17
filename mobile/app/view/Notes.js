Ext.define('AsBuilt.view.Notes', {
    extend: 'Ext.Panel',
    requires: ['Ext.dataview.List', 'Ext.field.Text'],
    xtype: 'app_notes',

    config: {
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
            store: 'Notes'
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
    }
});
