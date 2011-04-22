/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @include AsBuilt/DeleteFeature.js
 */

Ext.ns("AsBuilt.plugins");

/** api: (define)
 *  module = AsBuilt.plugins
 *  class = GCP
 *  extends = gxp.plugins.Tool
 */

/** api: constructor
 *  .. class:: GCP(config)
 *
 *    Add, modify and delete Ground Control Points.
 */
AsBuilt.plugins.GCP = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_gcp */
    ptype: "app_gcp",

    /** api: config[gcpManager]
     * ``AsBuilt.GCPManager`` The GCP Manager that should take care
     * of managing the actions of this GCP tool.
     */
    gcpManager: null,

    /** api: config[type]
     * ``Integer`` Coordinate system type to use, one of: 
     * AsBuilt.plugins.GCP.WORLD_COORDS or
     * AsBuilt.plugins.GCP.IMAGE_COORDS
     */
    type: null,

    /* start i18n */
    addTooltip: "Add Ground Control Point (GCP)",
    addText: "Add GCP",
    editTooltip: "Edit Ground Control Point (GCP)",
    editText: "Edit GCP",
    deleteTooltip: "Delete Ground Control Point (GCP)",
    deleteText: "Delete GCP",
    /* end i18n */

    constructor: function(config) {
        this.addEvents(
            /** api: event[beforepartialgcpadded]
             *  Fired before a part of a gcp has been added. Return false 
             *  to cancel.
             *
             *  Listener arguments:
             *  * tool - :class:`AsBuilt.plugins.GCP` this tool
             *  * feature - :class: `OpenLayers.Feature.Vector` the feature created
             */
            "beforepartialgcpadded",

            /** api: event[partialgcpadded]
             *  Fired when a part of a gcp has been added.
             *
             *  Listener arguments:
             *  * tool - :class:`AsBuilt.plugins.GCP` this tool
             *  * feature - :class: `OpenLayers.Feature.Vector` the feature created
             */
            "partialgcpadded",

            /** api: event[partialgcpremoved]
             *  Fired when a part of a gcp has been removed.
             *
             *  Listener arguments:
             *  * tool - :class:`AsBuilt.plugins.GCP` this tool
             *  * feature - :class: `OpenLayers.Feature.Vector` the feature created
             */
            "partialgcpremoved",

            "startmodify",

            "startadd",

            "endadd",

            "endmodify"
        );
        AsBuilt.plugins.GCP.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.gcpManager.registerTool(this);
        this.layer = new OpenLayers.Layer.Vector(null, {
            styleMap: new OpenLayers.StyleMap({'default':{
                strokeColor: "#00FF00",
                strokeOpacity: 1,
                strokeWidth: 3,
                fillColor: "#FF5500",
                fillOpacity: 0.5,
                pointRadius: 6,
                label : "${count}",
                labelAlign: "lm",
                labelXOffset: 10,
                fontSize: "12px",
                fontFamily: "Courier New, monospace",
                fontWeight: "bold"
            }})
        });
        this.layer.events.on({
            "beforefeatureadded": function(evt) {
                evt.feature.attributes.count = this.gcpManager.getCounter();
            },
            "sketchcomplete": function(evt) {
                return this.fireEvent("beforepartialgcpadded", this, evt.feature);
            },
            "featureremoved": function(evt) { 
                this.fireEvent("partialgcpremoved", this, evt.feature);
            },
            scope: this
        });
        this.drawControl = new OpenLayers.Control.DrawFeature(
            this.layer,    
            OpenLayers.Handler.Point, {
                eventListeners: {
                    "activate": function() {
                        this.fireEvent("startadd", this);
                    },
                    "deactivate": function() {
                        this.fireEvent("endadd", this);
                    },
                    "featureadded": function(evt) {
                        if (!this.layer.map) {
                            this.target.mapPanel.map.addLayer(this.layer);
                        }
                        //this.drawControl.deactivate();
                        this.fireEvent("partialgcpadded", this, evt.feature);
                    },
                    scope: this
                }
            }
        );
        this.modifyControl = new OpenLayers.Control.ModifyFeature(
            this.layer, {
                eventListeners: {
                    "activate": function() {
                        this.fireEvent("startmodify", this);
                    },
                    "deactivate": function() {
                        this.fireEvent("endmodify", this);
                    },
                    scope: this
                }
            }
        );
        this.deleteControl = new OpenLayers.Control.DeleteFeature(
            this.layer
        );
        var toggleGroup = this.toggleGroup || Ext.id();
        var actions = AsBuilt.plugins.GCP.superclass.addActions.call(this, [new GeoExt.Action({
            tooltip: this.addTooltip,
            iconCls: "gxp-icon-addfeature",
            text: this.addText,
            toggleGroup: toggleGroup,
            enableToggle: true,
            hidden: this.hidden,
            allowDepress: true,
            control: this.drawControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        }), new GeoExt.Action({
            tooltip: this.editTooltip,
            text: this.editText,
            iconCls: "gxp-icon-modifyfeature",
            toggleGroup: toggleGroup,
            enableToggle: true,
            hidden: this.hidden,
            allowDepress: true,
            control: this.modifyControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        }), new GeoExt.Action({
            tooltip: this.deleteTooltip,
            text: this.deleteText,
            iconCls: "gxp-icon-deletefeature",
            toggleGroup: toggleGroup,
            enableToggle: true,
            hidden: this.hidden,
            allowDepress: true,
            control: this.deleteControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        })]);
    }

});

/**
 * Coordinate types
 */
AsBuilt.plugins.GCP.WORLD_COORDS = 0;
AsBuilt.plugins.GCP.IMAGE_COORDS = 1;

Ext.preg(AsBuilt.plugins.GCP.prototype.ptype, AsBuilt.plugins.GCP);
