Ext.define('AsBuilt.controller.Drawing', {
    extend: 'Ext.app.Controller',
    requires: ['AsBuilt.view.DrawingDetails'],
    config: {
        refs: {
            main: 'main',
            drawing: 'app_drawing',
            doneButton: 'button[text="Done"]',
            detailsButton: 'button[text="Details"]',
            mapPanel: 'app_map',
            notesList: 'panel[type="notes"]',
            details: 'app_drawingdetails',
            popup: 'gxm_featurepopup'
        },

        control: {
            doneButton: {
                tap: 'hideDrawing'
            },
            detailsButton: {
                tap: 'showDetails'
            }
        }

    },

    hideDrawing: function() {
        Ext.Viewport.remove(this.getNotesList());
        var fid = this.getDrawing().getFid();
        Ext.Viewport.remove(this.getDrawing());
        Ext.Viewport.remove(this.getDetails());
        Ext.Viewport.setActiveItem(this.getMain());
        if (this.getPopup() && this.getPopup().getFeature().fid === fid) {
            this.getPopup().show();
        }
    },

    showDetails: function() {
        if (this.getNotesList()) {
            this.getNotesList().hide();
        }
        var details = this.getDetails();
        if (!details) {
            var panel = Ext.create('AsBuilt.view.DrawingDetails', {
                attributes: this.getDrawing().getAttributes(), 
                width: 325
            });
            panel.showBy(this.getDetailsButton());
        } else {
            if (details.getHidden()) {
                details.show();
            } else {
                details.hide();
            }
        }
    }

});
