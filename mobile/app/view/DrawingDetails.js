Ext.define('AsBuilt.view.DrawingDetails', {
    extend: 'Ext.Panel',
    requires: ['AsBuilt.util.Config'],
    xtype: 'app_drawingdetails',

    config: {
        zIndex: 1000,
        attributes: null
    },

    initialize: function() {
        var html = '<div class="drawingDetails">', attr = this.getAttributes();
        html += this.createRow(AsBuilt.util.Config.getFacilityNameTitle(), 
            attr[AsBuilt.util.Config.getFacilityNameField()]);
        html += this.createRow(AsBuilt.util.Config.getProjectNumberTitle(), 
            attr[AsBuilt.util.Config.getContractNumberField()]);
        html += this.createRow(AsBuilt.util.Config.getDrawingNumberTitle(), 
            attr[AsBuilt.util.Config.getDrawingNumberField()]);
        html += this.createRow(AsBuilt.util.Config.getDocumentTypeTitle(), 
            attr[AsBuilt.util.Config.getTypeDescriptionField()]);
        html += this.createRow(AsBuilt.util.Config.getDrawingDateTitle(), 
            attr[AsBuilt.util.Config.getDrawingDateField()]);
        html += '</div>';
        this.setHtml(html);
        this.callParent();
    },

    createRow: function(name, value) {
        return '<div class="detailRow"><div class="detailHeader">' + name + '</div>' +
            '<div class="detailContent">' + value + '</div></div>';
    }

});
