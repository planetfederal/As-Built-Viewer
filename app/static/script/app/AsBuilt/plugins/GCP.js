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
        this.controls = [];
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

            "partialgcpmodified",

            "activate",

            "deactivate"
        );
        AsBuilt.plugins.GCP.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.gcpManager.registerTool(this);
        this.layer = new OpenLayers.Layer.Vector(null, {
            styleMap: new OpenLayers.StyleMap({'default':{
                externalGraphic: "theme/app/img/geosilk/marker.png",
                pointRadius: 8,
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
                    "featureadded": function(evt) {
                        if (!this.layer.map) {
                            this.target.mapPanel.map.addLayer(this.layer);
                        }
                        this.fireEvent("partialgcpadded", this, evt.feature);
                    },
                    scope: this
                }
            }
        );
        var onComplete = function(feature) {
            this.fireEvent("partialgcpmodified", this, feature);
        };
        this.modifyControl = new OpenLayers.Control.DragFeature(
            this.layer, {
                onComplete: onComplete.createDelegate(this),
                eventListeners: {
                    "activate": function(evt) {
                        this.fireEvent(evt.type, this, evt.object);
                    },
                    "deactivate": function(evt) {
                        this.fireEvent(evt.type, this, evt.object);
                    },
                    scope: this
                }
            }
        );
        this.deleteControl = new OpenLayers.Control.DeleteFeature(
            this.layer
        );
        this.controls.push(this.drawControl, this.modifyControl, this.deleteControl);
        if (this.hidden !== true) {
            var toggleGroup = this.toggleGroup || Ext.id();
            var actions = AsBuilt.plugins.GCP.superclass.addActions.call(this, [new GeoExt.Action({
                tooltip: this.addTooltip,
                iconCls: "gxp-icon-addfeature",
                text: this.addText,
                toggleGroup: toggleGroup,
                enableToggle: true,
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
                allowDepress: true,
                control: this.deleteControl,
                deactivateOnDisable: true,
                map: this.target.mapPanel.map
            })]);
        } else {
            this.target.mapPanel.map.addControls(this.controls);
        }
    }

});

/**
 * Coordinate types
 */
AsBuilt.plugins.GCP.WORLD_COORDS = 0;
AsBuilt.plugins.GCP.IMAGE_COORDS = 1;

Ext.preg(AsBuilt.plugins.GCP.prototype.ptype, AsBuilt.plugins.GCP);
