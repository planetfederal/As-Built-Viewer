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
 *    A singelton class to manage several GCP plugins.
 */
AsBuilt.GCPManager = function(){

    var gcp = null;

    var gcps = [];

    var lastType = null;

    var counter = 1;

    var tools = [];

    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'id', type: 'int'},
           {name: 'imagex', type: 'float'},
           {name: 'imagey', type: 'float'},
           {name: 'worldx',  type: 'float'},
           {name: 'worldy', type: 'float'}
        ]
    });

    var me = Ext.apply(new Ext.util.Observable, {
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
                "beforepartialgcpadded": this.handleBeforeAdd,
                "partialgcpadded": this.handleAdd,
                "partialgcpremoved": this.handleRemove,
                "partialgcpmodified": this.handleModified,
                "activate": this.handleActivate,
                "deactivate": this.handleDeactivate
            });
        },
        handleActivate: function(tool, control) {
            for (var i=0,ii=tools.length; i<ii; ++i) {
                for (var j=0, jj=tools[i].controls.length; j<jj; ++j) {
                    if (tools[i].controls[j].CLASS_NAME === control.CLASS_NAME) {
                        tools[i].controls[j].activate();
                    }
                }
            }
        },
        handleDeactivate: function(tool, control) {
            for (var i=0,ii=tools.length; i<ii; ++i) {
                for (var j=0, jj=tools[i].controls.length; j<jj; ++j) {
                    if (tools[i].controls[j].CLASS_NAME === control.CLASS_NAME) {
                        tools[i].controls[j].deactivate();
                    }
                }
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
        handleBeforeAdd: function(tool, feature) {
            if (lastType !== null && tool.type === lastType) {
                 // TODO instruct the user that he should first digitize a point
                 // in the Source Map followed by a corresponding point in the
                 // Reference Map 
                 return false;
            }
        },
        getTool: function(type) {
            for (var i=0, ii=tools.length; i<ii; ++i) {
                if (tools[i].type === type) {
                    return tools[i];
                }
            }
        },
        handleAdd: function(tool, feature) {
            if (tool.type === AsBuilt.plugins.GCP.IMAGE_COORDS) {
                gcp = {source: feature};
            } else {
                gcp.target = feature;
                gcp.id = counter;
                store.loadData([[counter, gcp.source.geometry.x, gcp.source.geometry.y, gcp.target.geometry.x, gcp.target.geometry.y]], true);
                gcps.push(gcp);
                counter += 1;
                me.fireEvent("gcpchanged", me, me.getGCPs().length);
            }
            lastType = tool.type;
        },
        handleRemove: function(tool, feature) {
            lastType = null;
            for (var i=0, ii=gcps.length; i<ii; ++i) {
                if (gcps[i].source === feature) {
                    store.remove(store.getAt(store.find("id", gcps[i].id)));
                    // automatically remove the corresponding target
                    var target = gcps[i].target;
                    var layer = target.layer;
                    layer && layer.destroyFeatures([target]);
                }
                if (gcps[i].target === feature) {
                    store.remove(store.getAt(store.find("id", gcps[i].id)));
                    // automatically remove the corresponding source
                    var source = gcps[i].source;
                    var layer = source.layer;
                    layer && layer.destroyFeatures([source]);
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
