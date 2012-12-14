Ext.define('AsBuilt.controller.Notes', {
    requires: ['AsBuilt.util.Config', 'AsBuilt.view.Notes'],
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            list: '#notes',
            drawing: 'app_drawing',
            details: 'app_drawingdetails',
            addButton: '#addnote',
            main: 'main',
            notesField: '#notefield',
            notesButton: 'button[type="notes_button"]'
        },

        control: {
            notesButton: {
                tap: 'showNotes'
            },
            addButton: {
                tap: 'addNote'
            },
            notesField: {
                keyup: 'enableAdd'
            }
        }

    },

    enableAdd: function() {
        this.getAddButton().enable();
    },

    addNote: function() {
        var note = this.getList().down('textfield').getValue();
        if (note !== "") {
            var attr = {};
            var docIdField = AsBuilt.util.Config.getDocumentIdField();
            attr[AsBuilt.util.Config.getAuthorField()] = this.getMain().getUser();
            attr[AsBuilt.util.Config.getNoteField()] = note;
            attr[docIdField] = this.getDrawing().getFid().split(".").pop();
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
                            property: docIdField,
                            value: attr[docIdField]
                        })
                    });
                    this.getList().down('textfield').setValue('');
                },
                scope: this,
                data: xml
            });
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
