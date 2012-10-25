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
        Ext.Viewport.remove(this.getDrawing());
        Ext.Viewport.remove(this.getDetails());
        Ext.Viewport.setActiveItem(this.getMain());
        this.getPopup().show();
    },

    showDetails: function() {
        if (this.getNotesList()) {
            this.getNotesList().hide();
        }
        var feature;
        var layers = this.getMapPanel().getMap().layers;
        for (var i=0, ii=layers.length; i<ii; ++i) {
            var layer = layers[i];
            if (layer instanceof OpenLayers.Layer.Vector && layer.protocol) {
                feature = layer.selectedFeatures[0];
                break;
            }
        }
        var details = this.getDetails();
        if (!details) {
            var panel = Ext.create('AsBuilt.view.DrawingDetails', {attributes: feature.attributes, width: 325, height: 375});
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
