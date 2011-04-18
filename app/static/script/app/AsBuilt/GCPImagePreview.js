/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

Ext.ns("AsBuilt.plugins");

/** api: (define)
 *  module = AsBuilt.plugins
 *  class = GCPImagePreview
 *  extends = gxp.plugins.Tool
 */

/** api: constructor
 *  .. class:: GCPImagePreview(config)
 *
 *    Show preview of image warping.
 */
AsBuilt.plugins.GCPImagePreview = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_preview */
    ptype: "app_preview",

    /** api: config[gcpManager]
     * ``AsBuilt.GCPManager`` The GCP Manager, needed to know when
     * to enable/disable this tool and to retrieve the list of ground
     * control points.
     */
    gcpManager: null,

    /* start i18n */
    previewTooltip: "Preview warped image",
    previewText: "Preview",
    /* end i18n */

    enableButton: function(mgr, count) {
        this.actions[0].setDisabled(count < 3);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.gcpManager.on({
            "gcpchanged": this.enableButton, scope: this
        });
        var actions = AsBuilt.plugins.GCPImagePreview.superclass.addActions.call(this, [
            {
                tooltip: this.previewTooltip,
                iconCls: "gxp-icon-preview",
                disabled: true,
                text: this.previewText
            }
        ]);
    }

});

Ext.preg(AsBuilt.plugins.GCPImagePreview.prototype.ptype, AsBuilt.plugins.GCPImagePreview);
