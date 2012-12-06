Ext.define('AsBuilt.view.Search', {
    extend: 'Ext.form.Panel',
    requires: [
        'AsBuilt.util.Config',
        'AsBuilt.view.AutoComplete',
        'Ext.form.FieldSet', 
        'Ext.field.Select', 
        'Ext.field.Text'
    ],
    xtype: 'app_search',

    config: {
        scrollable: false,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            layout: 'vbox',
            margin: '0em 0.3em 0em 0em'
        },
        defaultType: 'container',
        items: [{
            items: [{
                xtype: 'fieldset',
                title: AsBuilt.util.Config.getDrawingFieldset(),
                items: [{
                    xtype: 'selectfield',
                    name: AsBuilt.util.Config.getTypeDescriptionField(),
                    defaultTabletPickerConfig: {
                        zIndex: 1051
                    },
                    label: AsBuilt.util.Config.getTypeLabel(),
                    value: "",
                    options: AsBuilt.util.Config.getTypeOptions()
                }, {
                    xtype: 'app_autocompletefield',
                    featureType: AsBuilt.util.Config.getDrawingsTable(),
                    label: AsBuilt.util.Config.getDocumentSubjectLabel(),
                    name: AsBuilt.util.Config.getDocumentSubjectField()
                }, {
                    xtype: 'app_autocompletefield',
                    featureType: AsBuilt.util.Config.getDrawingsTable(),
                    label: AsBuilt.util.Config.getDrawingNumberLabel(),
                    name: AsBuilt.util.Config.getDrawingNumberField()
                }, {
                    xtype: 'textfield',
                    label: AsBuilt.util.Config.getDrawingDateLabel(),
                    name: AsBuilt.util.Config.getDrawingDateField()
                }]
            }] 
        }, {
            items: [{
                xtype: 'fieldset',
                title: AsBuilt.util.Config.getFacilityFieldset(),
                items: [{
                    xtype: 'app_autocompletefield',
                    featureType: AsBuilt.util.Config.getFacilityNameView(),
                    label: AsBuilt.util.Config.getFacilityNameLabel(),
                    name: AsBuilt.util.Config.getFacilityNameField()
                }]
            }, {
                xtype: 'fieldset',
                title: AsBuilt.util.Config.getContractFieldset(),
                items: [{
                    xtype: 'app_autocompletefield',
                    label: AsBuilt.util.Config.getContractNumberLabel(),
                    featureType: AsBuilt.util.Config.getContractNumberView(),
                    name: AsBuilt.util.Config.getContractNumberField()
                }, {
                    xtype: 'app_autocompletefield',
                    label: AsBuilt.util.Config.getContractTitleLabel(),
                    featureType: AsBuilt.util.Config.getContractTitleView(),
                    name: AsBuilt.util.Config.getContractTitleField()
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xtype: 'checkboxfield',
                    label: AsBuilt.util.Config.getUseBBOXLabel(),
                    height: 40,
                    labelWidth: '70%',
                    name: "BBOX"
                }]
            }]
        }, {
            xtype: 'toolbar',
            margin: 0,
            height: 50,
            docked: 'bottom',
            items: [{
                xtype: 'spacer',
                flex: 1
            }, {
                xtype: 'button',
                id: 'filter',
                text: AsBuilt.util.Config.getSearchButtonText()
            }, {
                xtype: 'spacer',
                flex: 1
            }]
        }]
    }
});
