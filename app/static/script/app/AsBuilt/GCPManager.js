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
 *  class = GCPManager
 *  extends = Ext.util.Observable
 */

/** api: constructor
 *  .. class:: GCPManager()
 *
 *    A singleton class to manage several GCP plugins.
 */
AsBuilt.GCPManager = function(){

    /** private: gcp
     * ``Object`` The current Ground Control Point being processed.
     */
    var gcp = null;

    /** private: gcps
     *  ``Array`` The list of Ground Control Points which have been added.
     */
    var gcps = [];

    /** private: counter
     *  ``Integer`` A counter used to give ids to the Ground Control Points.
     */
    var counter = 1;

    /** private: tools
     *  ``Array`` The list of the tools that are managed by this manager.
     */
    var tools = [];

    /** private: store
     *  ``Ext.data.ArrayStore`` The store that keeps the list of GCPs.
     */
    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'id', type: 'int'},
           {name: 'imagex', type: 'float'},
           {name: 'imagey', type: 'float'},
           {name: 'worldx',  type: 'float'},
           {name: 'worldy', type: 'float'}
        ]
    });

    var me = Ext.apply(new Ext.util.Observable(), {
        constructor: function() {
            this.addEvents("gcpchanged");
            Ext.util.Observable.prototype.constructor.call(this, arguments);
        },
        getStore: function() {
            return store;
        },
        registerTool: function(tool) {
            tools.push(tool);
            tool.on({
                "partialgcpadded": this.handleAdd,
                "partialgcpremoved": this.handleRemove,
                "partialgcpmodified": this.handleModified,
                "activate": this.handleActivate,
                "deactivate": this.handleDeactivate
            });
        },
        handleActivate: function(tool, control) {
            for (var i=0,ii=tools.length; i<ii; ++i) {
                me.findControl(tools[i], control.CLASS_NAME).activate();
            }
        },
        handleDeactivate: function(tool, control) {
            for (var i=0,ii=tools.length; i<ii; ++i) {
                me.findControl(tools[i], control.CLASS_NAME).deactivate();
            }
        },
        handleModified: function(tool, feature) {
            var id = feature.attributes.count;
            var record = store.getAt(store.find("id", id));
            if (tool.type === AsBuilt.plugins.GCP.IMAGE_COORDS) {
                record.set("imagex", feature.geometry.x);
                record.set("imagey", feature.geometry.y);
            } else {
                record.set("worldx", feature.geometry.x);
                record.set("worldy", feature.geometry.y);
            }
        },
        getTool: function(type) {
            for (var i=0, ii=tools.length; i<ii; ++i) {
                if (tools[i].type === type) {
                    return tools[i];
                }
            }
        },
        findControl: function(tool, type) {
            for (var i=0, ii=tool.controls.length; i<ii; ++i) {
                if (tool.controls[i].CLASS_NAME === type) {
                    return tool.controls[i];
                }
            }
        },
        handleAdd: function(tool, feature) {
            if (tool.type === AsBuilt.plugins.GCP.IMAGE_COORDS) {
                gcp = {source: feature};
                me.findControl(tool, 'OpenLayers.Control.DrawFeature').deactivate();
                me.findControl(me.getTool(AsBuilt.plugins.GCP.WORLD_COORDS), 'OpenLayers.Control.DrawFeature').activate();
            } else {
                me.findControl(tool, 'OpenLayers.Control.DrawFeature').deactivate();
                me.findControl(me.getTool(AsBuilt.plugins.GCP.IMAGE_COORDS), 'OpenLayers.Control.DrawFeature').activate();
                gcp.target = feature;
                gcp.id = counter;
                store.loadData([[counter, gcp.source.geometry.x, gcp.source.geometry.y, gcp.target.geometry.x, gcp.target.geometry.y]], true);
                gcps.push(gcp);
                counter += 1;
                me.fireEvent("gcpchanged", me, me.getGCPs().length);
            }
        },
        handleRemove: function(tool, feature) {
            var layer = null;
            for (var i=0, ii=gcps.length; i<ii; ++i) {
                if (gcps[i].source === feature) {
                    store.remove(store.getAt(store.find("id", gcps[i].id)));
                    // automatically remove the corresponding target
                    var target = gcps[i].target;
                    layer = target.layer;
                    if (layer !== null) {
                        layer.destroyFeatures([target]);
                    }
                }
                if (gcps[i].target === feature) {
                    store.remove(store.getAt(store.find("id", gcps[i].id)));
                    // automatically remove the corresponding source
                    var source = gcps[i].source;
                    layer = source.layer;
                    if (layer !== null) {
                        layer.destroyFeatures([source]);
                    }
                }
            }
            me.fireEvent("gcpchanged", me, me.getGCPs().length);
        },
        getCounter: function() {
            return counter;
        },
        getGCPs: function() {
            var result = [];
            for (var i=0, ii=gcps.length; i<ii; ++i) {
                var gcp = gcps[i];
                if (gcp.source.geometry !== null && gcp.target.geometry !== null) {
                    result.push(gcp);
                }
            }
            return result;
        }
    });
    return me;
}();
