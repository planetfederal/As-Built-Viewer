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

    /** api: config[rectifierUrl]
     * ``String`` The URL of the rectifier application.
     */
    rectifierUrl: null,

    /* start i18n */
    popupBlockerTitle: "Popup blocked",
    popupBlockerMsg: "Popup window could not be opened.",
    /* end i18n */

    /** private: method[handleAddGeometry]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  Use a DrawFeature Control to add new geometries.
     */
    handleAddGeometry: function(store) {
        if (this.drawControl == null) {
            this.drawControl = new OpenLayers.Control.DrawFeature(
                new OpenLayers.Layer.Vector(),
                OpenLayers.Handler.Point, {
                eventListeners: {
                    "featureadded": function(evt) {
                        this.drawControl.deactivate();
                        this.feature.geometry = evt.feature.geometry.clone();
                        this.feature.state =  OpenLayers.State.UPDATE;
                        this.record.set("state", this.feature.state);
                        store.save();
                    },
                    scope: this
                }
            });
            this.feature.layer.map.addControl(this.drawControl);
        }
        this.drawControl.activate();
    },

    /** private: method[handleModifyGeometry]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  Use a ModifyFeature Control to modify existing geometries.
     */
    handleModifyGeometry: function(store) {
        if (this.modifyControl == null) {
            this.modifyControl = new OpenLayers.Control.ModifyFeature(
                this.feature.layer,
                {standalone: true}
            );
            this.feature.layer.map.addControl(this.modifyControl);
        }
        var layer = this.feature.layer;
        layer.events.on({
            "featuremodified": function() {
                layer.events.unregister("featuremodified", this, arguments.callee);
                this.modifyControl.deactivate();
                store.save();
            },
            scope: this
        });
        this.modifyControl.activate();
        this.modifyControl.selectFeature(this.feature);
    },

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
        var addOrModify = function(grid, rowIndex, colIndex) {
            grid.getSelectionModel().selectRow(rowIndex);
            this.record = store.getAt(rowIndex);
            this.feature = this.record.get("feature");
            if (this.feature.geometry === null) {
                this.handleAddGeometry(store);
            } else {
                this.handleModifyGeometry(store);
            }
        };
        columns.unshift({xtype: 'actioncolumn', width: 30, items: [{
            getClass: function(v, meta, rec) {
                if (rec.get("feature").geometry == null) {
                    this.items[0].tooltip = 'Add a new geometry by clicking in the map';
                    return "gxp-icon-addfeature";
                } else {
                    this.items[0].tooltip = 'Modify an existing geometry';
                    return "gxp-icon-modifyfeature";
                }
            },
            handler: addOrModify.createDelegate(this)
        }]});
        columns.unshift({xtype: 'actioncolumn', width: 30, items: [{
            tooltip: "Open up the image in the rectifier application",
            getClass: function(v, meta, rec) {
                return "gxp-icon-rectifier";
            },
            handler: function(grid, rowIndex, colIndex) {
                if (this.rectifierUrl !== null) {
                    var record = store.getAt(rowIndex);
                    // TODO urlEncode
                    var url = new Ext.Template(this.rectifierUrl).applyTemplate(record.get("feature").attributes);
                    var wh = window.open(url);
                    if (!wh) {
                        Ext.Msg.alert(this.popupBlockerTitle, this.popupBlockerMsg);
                    }
                }
            },
            scope: this
        }]});
        return columns;
    },

    /** private: method[onDestroy]
     *  Clean up anything created here before calling super onDestroy.
     */
    onDestroy: function() {
        // clean up references
        this.drawControl = null;
        this.modifyControl = null;
        this.feature = null;
        this.record = null;
        AsBuilt.grid.GeometryGrid.superclass.onDestroy.apply(this, arguments);
    }

});

/** api: xtype = app_geometrygrid */
Ext.reg('app_geometrygrid', AsBuilt.grid.GeometryGrid);
