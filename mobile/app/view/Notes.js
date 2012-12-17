Ext.define('AsBuilt.view.Notes', {
    extend: 'Ext.Panel',
    requires: [
        'Ext.dataview.List', 
        'Ext.field.Text',
        'AsBuilt.util.Config'
    ],
    xtype: 'app_notes',

    config: {
        width: 400,
        height: 200,
        zIndex: 1000,
        layout: 'fit',
        id: 'notes',
        items: [{
            xtype: 'list',
            cls: 'notes-list',
            grouped: true,
            itemTpl: new Ext.XTemplate(AsBuilt.util.Config.getNotesTpl(), {
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
                type: 'notefield',
                flex: 1,
                placeHolder: AsBuilt.util.Config.getEnterNotePlaceholder()
            }, {
                xtype: 'button',
                cls: 'addnotebutton',
                type: 'addnote',
                width: 75,
                height: 40,
                disabled: true,
                text: AsBuilt.util.Config.getEnterNoteButtonText()
            }]
        }]
    }
});
