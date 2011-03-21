Ext.ns("ImageBrowser");
/** api: constructor
 *  .. class:: SearchByStreet(config)
 *
 *    Search for images by street name, starting and ending intersections.
 */
ImageBrowser.SearchByStreet = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_searchbystreet */
    ptype: "app_searchbystreet",

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
        ImageBrowser.SearchByStreet.superclass.init.apply(this, arguments);
        this.initContainer();
    },

    addActions: function(config) {
        this.addOutput();
        return ImageBrowser.SearchByStreet.superclass.addActions.call(this, []);
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
                height: 200,
                region: "north",
                border: false,
                bodyStyle: "padding: 5px",
                items: [{
                    xtype: "fieldset",
                    title: this.searchLabel,
                    items: [{
                        xtype: "combo",
                        width: 140,
                        disabled: true,
                        name: "streetname",
                        fieldLabel: "Street name"
                    }, {
                        xtype: "combo",
                        width: 140,
                        disabled: true,
                        name: "start_intersection",
                        fieldLabel: "Starting intersection"
                    }, {
                        xtype: "combo",
                        width: 140,
                        disabled: true,
                        name: "end_intersection",
                        fieldLabel: "Ending intersection"
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
        return ImageBrowser.SearchByStreet.superclass.addOutput.call(this, this.container);
    }

});

Ext.preg(ImageBrowser.SearchByStreet.prototype.ptype, ImageBrowser.SearchByStreet);
