Ext.define('AsBuilt.controller.Notes', {
    requires: ['AsBuilt.util.Config', 'AsBuilt.view.Notes'],
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            map: '#drawing_map',
            list: '#notes',
            table: 'list[type="notes-list"]',
            drawing: 'app_drawing',
            details: 'app_drawingdetails',
            addButton: 'button[type="addnote"]',
            main: 'main',
            notesField: 'textfield[type="notefield"]',
            notesButton: 'button[type="notes_button"]',
            drawLineButton: 'button[type="draw_line"]',
            drawCircleButton: 'button[type="draw_circle"]',
            modifyButton: 'button[type="modify"]',
            deleteButton: 'button[type="delete"]',
            visibilityCheck: 'checkboxfield[type="show_annotations"]'
        },

        control: {
            visibilityCheck: {
                change: 'showVectorLayer'
            },
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

    showVectorLayer: function(cb, newValue, oldValue) {
        var vector = this.getMap().getMap().layers[1];
        vector.setVisibility(newValue);
    },

    enableDrawButtons: function() {
        var records = this.getTable().getSelection();
        if (records.length >= 1) {
            var record = records[0];
            var annotation = record.get('ANNOTATION');
            var vector = this.getMap().getMap().layers[1];
            vector.removeAllFeatures();
            if (annotation !== null) {
                var features = new OpenLayers.Format.GeoJSON().read(annotation);
                vector.addFeatures(features);
            }
            this.getDrawLineButton().enable();
            this.getDrawCircleButton().enable();
            this.getModifyButton().enable();
            this.getDeleteButton().enable();
        }
    },

    enableAdd: function() {
        this.getAddButton().enable();
    },

    saveAnnotation: function(layer) {
        // get the current selected note
        var record = this.getTable().getSelection()[0];
        var noteId = record.get(AsBuilt.util.Config.getNoteIdField());
        var attr = {};
        attr['ANNOTATION'] = new OpenLayers.Format.GeoJSON().write(layer.features);
        var feature = new OpenLayers.Feature.Vector(null, attr);
        feature.fid = noteId;
        feature.state = OpenLayers.State.UPDATE;
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
                record.set('ANNOTATION', attr['ANNOTATION']);
            },
            data: xml
        });
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
                    var result = format.read(response.responseXML || response.responseText);
                    var id = result.insertIds[0];
                    // reload store
                    Ext.getStore('Notes').load({
                        callback: function() {
                            this.getList().down('textfield').setValue('');
                            this.showNotes();
                            var record = Ext.getStore('Notes').findRecord('NOTE_ID', id);
                            this.getTable().select(record);
                        },
                        scope: this,
                        filter: new OpenLayers.Filter.Comparison({
                            type: '==',
                            property: docIdField,
                            value: attr[docIdField]
                        })
                    });
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
