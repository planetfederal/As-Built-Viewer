Ext.define('AsBuilt.controller.HideDrawing', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            drawing: 'app_drawing',
            doneButton: 'button[text="Done"]',
            notesButton: 'button[title="Notes"]',
            notesList: 'list'
        },

        control: {
            doneButton: {
                tap: 'hideDrawing'
            }
        }

    },

    hideDrawing: function() {
        Ext.Viewport.remove(this.getDoneButton());
        Ext.Viewport.remove(this.getNotesButton());
        Ext.Viewport.remove(this.getNotesList());
        Ext.Viewport.remove(this.getDrawing());
    }

});

