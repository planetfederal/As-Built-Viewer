Ext.define('AsBuilt.controller.Notes', {
    requires: ['AsBuilt.util.Config', 'AsBuilt.view.Notes'],
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            list: '#notes',
            table: '#notes-list',
            drawing: 'app_drawing',
            details: 'app_drawingdetails',
            addButton: 'button[type="addnote"]',
            main: 'main',
            notesField: 'textfield[type="notefield"]',
            notesButton: 'button[type="notes_button"]',
            drawLineButton: 'button[type="draw_line"]',
            drawCircleButton: 'button[type="draw_circle"]'
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
            },
            table: {
                selectionchange: 'enableDrawButtons' 
            }
        }

    },

    enableDrawButtons: function() {
        var count = this.getTable().getSelectionCount();
        if (count >= 1) {
            this.getDrawLineButton().enable();
            this.getDrawCircleButton().enable();
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
