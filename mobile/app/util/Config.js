Ext.define('AsBuilt.util.Config', {
    singleton : true,
    config : {
        bounds: [-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212],
        mapQuestAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>"
    },
    constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});
