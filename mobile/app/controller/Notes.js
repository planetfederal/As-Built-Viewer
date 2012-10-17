Ext.define('AsBuilt.controller.Notes', {
    requires: ['AsBuilt.view.Notes'],
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
            var list = Ext.create("AsBuilt.view.Notes");
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
