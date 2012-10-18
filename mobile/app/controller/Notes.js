Ext.define('AsBuilt.controller.Notes', {
    requires: ['AsBuilt.view.Notes'],
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            list: 'panel[type="notes"]',
            drawing: 'app_drawing',
            details: 'app_drawingdetails',
            addButton: 'button[text="Add"]',
            main: 'main',
            notesButton: 'button[title="Notes"]'
        },

        control: {
            notesButton: {
                tap: 'showNotes'
            },
            addButton: {
                tap: 'addNote'
            }
        }

    },

    addNote: function() {
        var attr = {};
        attr["AUTHOR"] = this.getMain().getUser();
        attr["NOTE"] = this.getList().down('textfield').getValue();
        attr["DOC_ID"] = this.getDrawing().getFid().split(".").pop();
        var feature = new OpenLayers.Feature.Vector(null, attr);
        feature.state = OpenLayers.State.INSERT;
        var format = new OpenLayers.Format.WFST({
            featurePrefix: AsBuilt.util.Config.getPrefix(),
            featureType: AsBuilt.util.Config.getNotesTable(),
            geometryName: null,
            featureNS: AsBuilt.util.Config.getFeatureNS(),
            version: "1.1.0"
        });
        var xml = format.write([feature]);
        var url = AsBuilt.util.Config.getGeoserverUrl();
        OpenLayers.Request.POST({
            url: url,
            callback: function(response) {
                // reload store
                Ext.getStore('Notes').load({
                    filter: new OpenLayers.Filter.Comparison({
                        type: '==',
                        property: 'DOC_ID',
                        value: attr["DOC_ID"]
                    })
                });
                this.getList().down('textfield').setValue('');
            },
            scope: this,
            data: xml
        });
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
