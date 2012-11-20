Ext.define("AsBuilt.view.FeatureEditorForm",{
    extend: 'Ext.form.Panel',
    alias: 'widget.app_editorform',
    requires: [
        'Ext.field.Text',
        'Ext.field.Number',
        'Ext.field.Checkbox',
        'Ext.field.DatePicker'
    ],
    config: {
        language: "en",
        schema: null,
        regexes: {
            "text": new RegExp(
                "^(text|string)$", "i"
            ),
            "number": new RegExp(
                "^(number|float|decimal|double|int|long|integer|short)$", "i"
            ),
            "boolean": new RegExp(
                "^(boolean)$", "i"
            ),
            "date": new RegExp(
                "^(date|dateTime)$", "i"
            )
        }
    },
    initialize:function() {
        var r = this.getRegexes();
        this.getSchema().each(function(record) {
            var field = this.recordToField(record);
            if (field !== null) {
                this.add(field);
            } 
        }, this);
        this.callParent();
    },

    recordToField: function(record, options) {
        options = options || {};
        var r = this.getRegexes();
        var type = record.get("type");
        type = type.split(":").pop();
        var fieldConfig = null;
        options.name = record.get('name');
        var annotation = record.get('annotation');
        if (annotation && annotation.appinfo) {
            options.label = Ext.decode(annotation.appinfo[0]).title[this.getLanguage()];
        } else {
            options.label = record.get('name');
        }
        if (annotation && annotation.documentation) {
            for (var i=0, ii=annotation.documentation.length; i<ii; ++i) {
                if (annotation.documentation[i].lang === this.getLanguage()) {
                    options.placeHolder = annotation.documentation[i].textContent;
                    break;
                }
            }
        }
        if (type.match(r["text"])) {
            fieldConfig = Ext.apply({
                xtype: 'textfield'
            }, options);
        } else if (type.match(r["number"])) {
            fieldConfig = Ext.apply({
                xtype: 'numberfield'
            }, options);
        } else if (type.match(r["boolean"])) {
            fieldConfig = Ext.apply({
                xtype: 'checkboxfield'
            }, options);
        } else if (type.match(r["date"])) {
            fieldConfig = Ext.apply({
                xtype: 'datepickerfield'
            }, options);
        }
        return fieldConfig;
    }

});
