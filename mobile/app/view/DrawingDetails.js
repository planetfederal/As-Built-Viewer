Ext.define('AsBuilt.view.DrawingDetails', {
    extend: 'Ext.Panel',
    xtype: 'app_drawingdetails',

    config: {
        attributes: null
    },

    initialize: function() {
        var html = '', attr = this.getAttributes();
        html += this.createRow("Facility Name", attr.SFACILITYNAME);
        html += this.createRow("Project Number", attr.SCONTRACTNUM);
        html += this.createRow("Drawing Number", attr.IDRAWNUM);
        html += this.createRow("Drawing Type", attr.TYPEDESC);
        html += this.createRow("Drawing Date", attr.DDRAWDATE);
        this.setHtml(html);
        this.callParent();
    },

    createRow: function(name, value) {
        return '<div class="detailHeader">' + name + '</div>' +
            '<div class="detailContent">' + value + '</div>';
    }

});
