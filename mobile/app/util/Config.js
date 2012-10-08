Ext.define('AsBuilt.util.Config', {
    singleton : true,
    config : {
        bounds: [-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212],
        mapQuestAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        /**
         * @cfg {String} geoserverUrl
         * The URL where GeoServer WMS/WFS can be accessed. This needs to be on the same origin as the web app.
         */
        geoserverUrl: '/geoserver/ows',

        /**
         * @cfg {String} featureNS
         * The namespace URI used on the WFS.
         */
        featureNS: 'http://www.sfmta.com/',

        /**
         * @cfg {String} prefix
         * The prefix of the namespace.
         */
        prefix: "asbuilt",

        drawingsTable: "DOCS",

        notesTable: "NOTES",

        geomField: "GEOM",

        imagesLayer: 'images'
    },
    constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});
