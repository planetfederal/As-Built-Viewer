Ext.define('AsBuilt.view.DrawingDetails', {
    extend: 'Ext.Panel',
    xtype: 'app_drawingdetails',

    config: {
        zIndex: 1000,
        attributes: null
    },

    initialize: function() {
        var html = '<div class="drawingDetails">', attr = this.getAttributes();
        html += this.createRow("Facility Name", attr.SFACILITYNAME);
        html += this.createRow("Project Number", attr.SCONTRACTNUM);
        html += this.createRow("Drawing Number", attr.IDRAWNUM);
        html += this.createRow("Drawing Type", attr.TYPEDESC);
        html += this.createRow("Drawing Date", attr.DDRAWDATE);
        html += '</div>';
        this.setHtml(html);
        this.callParent();
    },

    createRow: function(name, value) {
        return '<div class="detailRow"><div class="detailHeader">' + name + '</div>' +
            '<div class="detailContent">' + value + '</div></div>';
    }

});
