/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @include plugins/FeatureEditor.js
 */

Ext.ns("AsBuilt.plugins");

/** api: (define)
 *  module = AsBuilt.plugins
 *  class = FeatureEditor
 *  extends = gxp.plugins.FeatureEditor
 */

/** api: constructor
 *  .. class:: FeatureEditor(config)
 */
AsBuilt.plugins.FeatureEditor = Ext.extend(gxp.plugins.FeatureEditor, {

    /** api: ptype = app_featureeditor */
    ptype: "app_featureeditor",

    addOutput: function(config) {
        var notesManager = this.target.tools[this.initialConfig.notesManager];
        Ext.apply(config, {
            notesManager: notesManager
        });
        AsBuilt.plugins.FeatureEditor.superclass.addOutput.apply(this, arguments);
    }

});

Ext.preg(AsBuilt.plugins.FeatureEditor.prototype.ptype, AsBuilt.plugins.FeatureEditor);
