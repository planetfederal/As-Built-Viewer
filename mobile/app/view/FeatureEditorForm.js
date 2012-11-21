Ext.define("AsBuilt.view.FeatureEditorForm",{
    extend: 'Ext.form.Panel',
    alias: 'widget.app_editorform',
    requires: [
        'Ext.field.Text',
        'Ext.field.Number',
        'Ext.field.Checkbox',
        'Ext.field.DatePicker',
        'Ext.field.Select',
        'Ext.data.Validations'
    ],
    config: {
        /** @cfg {OpenLayers.Feature.Vector}
         *  The feature being edited/displayed.
         */
        feature: null,
        /** @cfg {Object}
         *  An object with as keys the field names, which will provide the ability
         *  to override the xtype that is created by default based on the
         *  schema. 
         */
        fieldConfig: null,
        /** @cfg {Array}
         *  List of field config names corresponding to feature attributes.  If
         *  not provided, fields will be derived from attributes. If provided,
         *  the field order from this list will be used, and fields missing in the
         *  list will be excluded.
         */
        formFields: null,
        /** @cfg {Array}
         *  Optional list of field names (case sensitive) that are to be
         *  excluded from the form.
         */
        excludeFields: null,
        /** @cfg {Boolean}
         *  Set to true to disable editing. Default is false.
         */
        readOnly: null,
        language: "en",
        schema: null,
        model: null,
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
        Ext.applyIf(Ext.data.Validations, {
            range: function(config, value) {
                return value !== undefined && value >= config.minValue && value <= config.maxValue;
            }
        });
        var r = this.getRegexes(), fieldCfg, record;
        var name, fields = [], schema = this.getSchema();
        var modelConfig = {
            fields: [],
            validations: []
        };
        if (this.getFormFields()) {
            for (var i=0, ii=this.getFormFields().length; i<ii; ++i) {
                name = this.getFormFields()[i];
                var idx = schema.findExact('name', name);
                if (idx !== -1) {
                    record = schema.getAt(idx);
                    fieldCfg = this.recordToField(record, modelConfig);
                    if (fieldCfg !== null) {
                        fields.push(fieldCfg);
                    }
                }
            }
        } else {
            schema.each(function(record) {
                var type = record.get("type"); 
                name = record.get("name");
                if (type.match(/^[^:]*:?((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry))/)) {
                    // exclude gml geometries
                    return;
                }
                var fieldCfg = this.recordToField(record, modelConfig);
                if (fieldCfg !== null) {
                    fields.push(fieldCfg);
                }
            }, this);
        }
        this.modelId = Ext.id(null, 'gxm-attribute-model');
        var model = Ext.define(this.modelId, {
            extend: 'Ext.data.Model',
            config: modelConfig
        });
        this.setModel(model);
        this.add(fields);
        this.callParent();
    },

    validate: function() {
        var instance = Ext.create(this.modelId, this.getValues());
        var errors = instance.validate();
    },

    recordToField: function(record, modelConfig) {
        var name = record.get('name');
        if (this.getExcludeFields() && this.getExcludeFields().indexOf(name) !== -1) {
            return null;
        }
        var options = {};
        if (this.getReadOnly() === true) {
            options.readOnly = true;
        }
        var feature = this.getFeature();
        if (feature && feature.attributes[name] !== undefined) {
            options.value = feature.attributes[name];
        }
        var r = this.getRegexes();
        var type = record.get("type");
        type = type.split(":").pop();
        modelConfig.fields.push({name: name, type: type});
        var fieldConfig = null;
        options.name = name;
        var restriction = record.get("restriction") || {};
        var annotation = record.get('annotation');
        if (annotation && annotation.appinfo) {
            options.label = Ext.decode(annotation.appinfo[0]).title[this.getLanguage()];
        } else {
            options.label = record.get('name');
        }
        if (this.getFieldConfig() && this.getFieldConfig()[name]) {
            Ext.apply(options, this.getFieldConfig()[name]);
        }
        var i, ii;
        if (annotation && annotation.documentation) {
            for (i=0, ii=annotation.documentation.length; i<ii; ++i) {
                if (annotation.documentation[i].lang === this.getLanguage()) {
                    options.placeHolder = annotation.documentation[i].textContent;
                    break;
                }
            }
        }
        if (restriction.enumeration) {
            var store = [];
            for (i=0, ii=restriction.enumeration.length; i<ii; ++i) {
                store.push({text: restriction.enumeration[i], value: restriction.enumeration[i]});
            }
            fieldConfig = Ext.apply({
                xtype: "selectfield",
                options: store
            }, options);
        } else if (type.match(r["text"])) {
            var minLength = restriction["minLength"] !== undefined ?
                parseFloat(restriction["minLength"]) : undefined;
            var maxLength = restriction["maxLength"] !== undefined ?
                parseFloat(restriction["maxLength"]) : undefined;
            fieldConfig = Ext.apply({
                xtype: 'textfield',
                maxLength: maxLength
            }, options);
        } else if (type.match(r["number"])) {
            var maxValue = restriction["maxInclusive"] !== undefined ?
                parseFloat(restriction["maxInclusive"]) : undefined;
            var minValue = restriction["minInclusive"] !== undefined ?
                parseFloat(restriction["minInclusive"]) : undefined;
            if (maxValue !== undefined || minValue !== undefined) {
                modelConfig.validations.push({
                    field: name,
                    type: 'range',
                    message: 'out of range, min: ' + minValue + ', max: ' + maxValue,
                    minValue: minValue,
                    maxValue: maxValue
                });
            }
            fieldConfig = Ext.apply({
                xtype: 'numberfield',
                minValue: minValue,
                maxValue: maxValue
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
