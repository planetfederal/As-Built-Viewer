Ext.ns("ImageBrowser");
/** api: constructor
 *  .. class:: SearchByAttribute(config)
 *
 *    Search for images by their attributes.
 */
ImageBrowser.SearchByAttribute = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_searchbyattribute */
    ptype: "app_searchbyattribute",

    /** api: config[searchLabel]
     *  ``String``
     *  Label for search input (i18n).
     */
    searchLabel: "Search",

    /** api: method[init]
     *  :arg target: ``gxp.Viewer``
     *  Initialize the plugin.
     */
    init: function(target) {
        ImageBrowser.SearchByAttribute.superclass.init.apply(this, arguments);
        this.initContainer();
    },

    addActions: function(config) {
        this.addOutput();
        return ImageBrowser.SearchByAttribute.superclass.addActions.call(this, []);
    },

    /** private: method[initContainer]
     *  Create the primary output container.  All other items will be added to 
     *  this when the group feature store is ready.
     */
    initContainer: function() {
        this.container = new Ext.Container(Ext.apply({
            layout: "border",
            items: [{
                layout: "form",
                height: 100,
                region: "north",
                border: false,
                bodyStyle: "padding: 5px",
                items: [{
                    xtype: "fieldset",
                    title: this.searchLabel,
                    items: [{
                        xtype: "textfield",
                        name: "keywords",
                        anchor: "100%",
                        hideLabel: true
                    }]
                }]
            }, {
                xtype: "container",
                layout: "fit",
                region: "center",
                ref: "gridContainer"
            }]
        }, this.outputConfig));
        delete this.outputConfig;
    },

    /** api: method[addOutput]
     */
    addOutput: function() {
        return ImageBrowser.SearchByAttribute.superclass.addOutput.call(this, this.container);
    }

});

Ext.preg(ImageBrowser.SearchByAttribute.prototype.ptype, ImageBrowser.SearchByAttribute);
