/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

Ext.ns("AsBuilt");

/** api: (define)
 *  module = AsBuilt
 *  class = AddGeometryGrid
 *  extends = gxp.grid.FeatureGrid
 */

/** api: constructor
 *  .. class:: AddGeometryGrid(config)
 *
 *    A FeatureGrid which has an action column which contains a tool to draw
 *    a new geometry, this can be used for features that have a null geometry.
 */
AsBuilt.AddGeometryGrid = Ext.extend(gxp.grid.FeatureGrid, {

    /** api: method[getColumns]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  :return: ``Array``
     *  
     *  Gets the configuration for the column model.
     */
    getColumns: function(store){
        var columns = AsBuilt.AddGeometryGrid.superclass.getColumns.apply(this, arguments);
        for (var i=0, ii=columns.length; i<ii; i++) {
            var column = columns[i];
            column.editor = {
                xtype: 'textfield'
            };
        }
        columns.unshift({xtype: 'actioncolumn', width: 30, items: [{
            getClass: function(v, meta, rec) {
                if (rec.get("feature").geometry == null) {
                    return "gxp-icon-addfeature";
                } else {
                    return "gxp-icon-modifyfeature";
                }
            },
            handler: function(grid, rowIndex, colIndex) {
                grid.getSelectionModel().selectRow(rowIndex);
                this.record = store.getAt(rowIndex);
                this.feature = this.record.get("feature");
                if (this.feature.geometry === null) {
                    if (this.drawControl == null) {
                        this.drawControl = new OpenLayers.Control.DrawFeature(
                            new OpenLayers.Layer.Vector(),
                            OpenLayers.Handler.Point, {
                            eventListeners: {
                                featureadded: function(evt) {
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
                } else {
                    if (this.modifyControl == null) {
                        this.modifyControl = new OpenLayers.Control.ModifyFeature(
                            this.feature.layer,
                            {standalone: true}
                        );
                        this.feature.layer.map.addControl(this.modifyControl);
                    }
                    this.feature.layer.events.on({
                        "featuremodified": function() {
                            this.feature.layer.events.unregister("featuremodified", this, arguments.callee);
                            this.modifyControl.deactivate();
                            store.save();
                        },
                        scope: this
                    });
                    this.modifyControl.activate();
                    this.modifyControl.selectFeature(this.feature);
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
        this.feature = null;
        this.record = null;
        AsBuilt.AddGeometryGrid.superclass.onDestroy.apply(this, arguments);
    }

});

/** api: xtype = app_featuregrid */
Ext.reg('app_addgeometrygrid', AsBuilt.AddGeometryGrid);
