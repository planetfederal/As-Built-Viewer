/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

Ext.ns("AsBuilt.grid");

/** api: (define)
 *  module = AsBuilt.grid
 *  class = GeometryGrid
 *  extends = gxp.grid.FeatureGrid
 */

/** api: constructor
 *  .. class:: GeometryGrid(config)
 *
 *    A FeatureGrid which has an action column which contains a tool to draw
 *    a new geometry, this can be used for features that have a null geometry.
 *    In case a feature has a geometry, it can be modified.
 */
AsBuilt.grid.GeometryGrid = Ext.extend(gxp.grid.FeatureGrid, {

    /** api: config[rectifierBaseUrl]
     * ``String`` Base URL for the rectifier application.
     */
    rectifierBaseUrl: null,

    /* start i18n */
    popupBlockerTitle: "Popup blocked",
    popupBlockerMsg: "Popup window could not be opened.",
    /* end i18n */

    /** api: method[getColumns]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  :return: ``Array``
     *  
     *  Gets the configuration for the column model.
     */
    getColumns: function(store){
        var columns = AsBuilt.grid.GeometryGrid.superclass.getColumns.apply(this, arguments);
        for (var i=0, ii=columns.length; i<ii; i++) {
            var column = columns[i];
            column.editor = {
                xtype: 'textfield'
            };
        }
        columns.unshift({xtype: 'actioncolumn', width: 30, items: [{
            tooltip: "Open up the image in the rectifier application",
            getClass: function(v, meta, rec) {
                // only show if width and height are known
                var feature = rec.get("feature");
                if (feature.attributes.WIDTH !== undefined && feature.attributes.HEIGHT !== undefined) {
                    return "gxp-icon-rectifier";
                }
            },
            handler: function(grid, rowIndex, colIndex) {
                if (this.rectifierBaseUrl !== null) {
                    var record = store.getAt(rowIndex);
                    var feature = record.get("feature");
                    var params = {
                        fid: feature.fid,
                        imagepath: feature.attributes.PATH.substring(1)+"."+feature.attributes.FILETYPE,
                        width: feature.attributes.WIDTH,
                        height: feature.attributes.HEIGHT
                    };
                    var url = this.rectifierBaseUrl + Ext.urlEncode(params);
                    var wh = window.open(url);
                    if (!wh) {
                        Ext.Msg.alert(this.popupBlockerTitle, this.popupBlockerMsg);
                    }
                }
            },
            scope: this
        }]});
        return columns;
    }

});

/** api: xtype = app_geometrygrid */
Ext.reg('app_geometrygrid', AsBuilt.grid.GeometryGrid);
