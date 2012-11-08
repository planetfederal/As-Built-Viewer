Ext.define('AsBuilt.store.Notes', {
    extend: 'Ext.data.JsonStore',

    requires: [
        'AsBuilt.util.Config',
        'AsBuilt.model.Note',
        'GXM.data.proxy.Protocol',
        'GXM.data.reader.Feature'
    ],

    config: {
        autoLoad: false,

        model: 'AsBuilt.model.Note',

        proxy: {
            type: 'gxm_protocol',
            setParamsAsOptions: true,
            protocol: new OpenLayers.Protocol.WFS({
                url: AsBuilt.util.Config.getGeoserverUrl(),
                version: "1.1.0",
                featureType: AsBuilt.util.Config.getNotesTable(),
                featureNS: AsBuilt.util.Config.getFeatureNS(),
                outputFormat: 'json',
                readFormat: new OpenLayers.Format.GeoJSON()
            }),
            reader: 'gxm_feature'
        }
    }
});
