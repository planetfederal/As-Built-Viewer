Ext.define('AsBuilt.store.Notes', {
    extend: 'Ext.data.JsonStore',

    requires: [
        'AsBuilt.util.Config',
        'AsBuilt.model.Note',
        'GXM.data.proxy.Protocol'
    ],

    config: {
        autoLoad: false,
        sorters: [{
            property: AsBuilt.util.Config.getTimestampField(),
            order: "ASC"
        }],
        grouper: {
            groupFn: function(record) {
                this.colors = this.colors || {};
                var author = record.get(AsBuilt.util.Config.getAuthorField());
                var doc = record.get(AsBuilt.util.Config.getDocumentIdField());
                if (!this.colors[doc]) {
                    this.colors[doc] = {
                        colors: AsBuilt.util.Config.getNoteHeaderColors().slice(0),
                        authors: {}
                    };
                }
                if (!this.colors[doc].authors[author]) {
                    this.colors[doc].authors[author] = this.colors[doc].colors.shift();
                }
                var color = this.colors[doc].authors[author];
                // make sure the colors are the same if the author is the same
                // but don't do any real grouping
                // TODO re-evaluate
                // could not find a way to do this in ST without using groups
                var unique = Math.random();
                return '<div class="note-group ' + unique + '" style="background-color:' + color + '">' + author + '</div>';
            }
        },
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
            reader: 'json'
        }
    }

});
