Ext.define('AsBuilt.util.Config', {
    singleton : true,
    config : {

        noteHeaderColors: ['red', 'green', 'blue', 'yellow', 'brown', 'magenta', 'cyan', 'orange'],

        /**
         * @cfg {Array} bounds
         * Initial map extent in Spherical Mercator.
         */
        bounds: [-13630460.905642, 4544450.3840456, -13624163.334642, 4552410.6141212],

        /**
         * @cfg {String} mapQuestAttribution
         * Attribution to display for the MapQuest base layer.
         */
        mapQuestAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",

        /**
         * @cfg {String} geoserverUrl
         * The URL where GeoServer WMS/WFS can be accessed. This needs to be on the 
         * same origin as the web app.
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

        /**
         * @cfg {String} listItemTpl
         * The template used for the list / table below the map.
         */
        listItemTpl: '<div class="table-cell col1"><tpl if="feature.attributes.SDRAWTITLE != null">{feature.attributes.SDRAWTITLE}<tpl else>Unknown</tpl></div><div class="table-cell col2"><tpl if="feature.attributes.TYPEDESC != null">{feature.attributes.TYPEDESC}<tpl else>Type unknown</tpl></div><div class="table-cell col3"><tpl if="feature.attributes.DDRAWDATE != null">{feature.attributes.DDRAWDATE}<tpl else>Unknown</tpl></div>',

        /**
         * @cfg {String} featureInfoTpl
         * The template used for the feature info popup.
         */
        featureInfoTpl: '<div class="fp-title"><tpl if="feature.attributes.SDRAWTITLE != null">{feature.attributes.SDRAWTITLE}<tpl else>Title unknown</tpl><span class="follow">&gt;</span></div><div class="fp-container"><div class="fp-type"><tpl if="feature.attributes.TYPEDESC != null">{feature.attributes.TYPEDESC}<tpl else>Type unknown</tpl></div><div class="fp-date"><tpl if="feature.attributes.DDRAWDATE != null">{feature.attributes.DDRAWDATE}<tpl else>Date unknown</tpl></div></div>',

        /**
         * @cfg {String} notesTpl
         * The template used for displaying a note.
         */
        notesTpl: '<div class="notesNote">{NOTE}</div><div class="notesAuthor">Added {TIMESTAMP:this.formatTS} by {AUTHOR}</div>',

        /**
         * @cfg {Object} selectStyle
         * OpenLayers style object for displaying a selected feature.
         */
        selectStyle: {
            pointRadius: 12,
            fillColor: 'F98D0C',
            strokeColor: 'E3E3D9',
            strokeWidth: 4
        },

        /**
         * @cfg {Object} geolocationOptions
         * The geolocation options to use when retrieving the user's location.
         */
        geolocationOptions: {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 7000
        },

        /**
         * @cfg {Object} geolocationStyle
         * OpenLayers style object for showing the user's location.
         */
        geolocationStyle: {
            graphicName: 'circle',
            strokeColor: '#ff0000',
            strokeWidth: 1,
            fillOpacity: 0.5,
            fillColor: '#0000ff',
            pointRadius: 8
        },

        /**
         * @cfg {Object} geolocationStyle
         * OpenLayers style object for showing the accuracy of the user's 
         * location.
         */ 
        geolocationAccuracyStyle: {
            fillColor: '#000',
            fillOpacity: 0.1,
            strokeWidth: 0
        },
        /**
         * @cfg {Integer} maxFeatures
         * The maxiumum number of features to retrieve through WFS.
         */ 
        maxFeatures: 100,

        /**
         * @cfg {Integer} featureInfoBuffer
         * The value to use the vendor-specific BUFFER parameter of GeoServer
         * while doing WMS GetFeatureInfo requests.
         */
        featureInfoBuffer: 15,

        /**
         * @cfg {String} maxFeaturesTpl
         * The template used to display when more than the maximum number
         * of features has been reached.
         */
        maxFeaturesTpl: 'Your search returned {number}{text} images. Showing the first {first}.',

        /**
         * @cfg {String} drawingsTable
         * The main featureType used in this application.
         */
        drawingsTable: "DOCS",

        /**
         * @cfg {String} facilityNameView
         * The featureType used to get the distinct values of facility names.
         */
        facilityNameView: "VW_SFACILITYNAME",

        /**
         * @cfg {String} contractNumberView
         * The featureType used to get the distinct values of contract numbers.
         */
        contractNumberView: "VW_SCONTRACTNUM",

        /**
         * @cfg {String} contractTitleView
         * The featureType used to get the distinct values of contract title.
         */
        contractTitleView: "VW_SCONTRACTTITLE",

        /**
         * @cfg {String} notesTable
         * The featureType used to get the notes.
         */
        notesTable: "NOTES",

        /**
         * @cfg {String} geomField
         * The name of the geometry field of the drawingsTable.
         */
        geomField: "GEOM",

        /**
         * @cfg {String} authorField
         * The name of the author field of the notesTable.
         */
        authorField: "AUTHOR",

        /**
         * @cfg {String} timestampField
         * The name of the timestamp field of the notesTable.
         */
        timestampField: "TIMESTAMP",

        /**
         * @cfg {String} noteField
         * The name of the note field of the notesTable.
         */
        noteField: "NOTE",

        /**
         * @cfg {String} documentIdField
         * The primary key of the drawingsTable.
         */
        documentIdField: "DOC_ID",

        /**
         * @cfg {String} pathField
         * The name of the (file)path field of the drawingsTable.
         */
        pathField: "PATH",

        /**
         * @cfg {String} documentSubjectField
         * The name of the document subject field of the drawingsTable.
         */
        documentSubjectField: "DOCSUBJECT",

        /**
         * @cfg {String} fileTypeField
         * The name of the file type field of the drawingsTable.
         */
        fileTypeField: "FILETYPE",

        /**
         * @cfg {String} imageWidthField
         * The name of the image width field of the drawingsTable.
         */
        imageWidthField: "WIDTH",

        /**
         * @cfg {String} imageWidthField
         * The name of the image height field of the drawingsTable.
         */
        imageHeightField: "HEIGHT",

        /**
         * @cfg {String} facilityNameField
         * The name of the facility name field of the drawingsTable.
         */
        facilityNameField: "SFACILITYNAME",

        /**
         * @cfg {String} contractNumberField
         * The name of the contract number field of the drawingsTable.
         */
        contractNumberField: "SCONTRACTNUM",

        /**
         * @cfg {String} contractTitleField
         * The name of the contract title field of the drawingsTable.
         */
        contractTitleField: "SCONTRACTTITLE",

        /**
         * @cfg {String} drawingNumberField
         * The name of the drawing number field of the drawingsTable.
         */
        drawingNumberField: "IDRAWNUM",

        /**
         * @cfg {String} typeDescriptionField
         * The name of the type description field of the drawingsTable.
         */
        typeDescriptionField: "TYPEDESC",

        /**
         * @cfg {String} drawingDateField
         * The name of the drawing date field of the drawingsTable.
         */
        drawingDateField: "DDRAWDATE",

        /**
         * @cfg {String} imagesLayer
         * The name of the WMS layer containing the actual drawings.
         */
        imagesLayer: 'images',

        /**
         * @cfg {Array} typeOptions
         * Possible values for typeDescriptionField.
         */
        typeOptions: [
            {
                text: 'All types',
                value: ''
            }, {
                text: 'MUNI Drawings Numbered Plans (MDNP)',
                value: 'MUNI Drawings Numbered Plans (MDNP)'
            }, {
                text: 'UnClassified Scans',
                value: 'UnClassified Scans'
            }, {
                text: 'MUNI SHOP Drawings (MUSH)',
                value: 'MUNI SHOP Drawings (MUSH)'
            }, {
                text: 'MUNI BART Drawings (MUBA)',
                value: 'MUNI BART Drawings (MUBA)'
            }, {
                text: 'BOE Numbered Plans',
                value: 'BOE Numbered Plans'
            }
        ],

        /* start i18n */
        enterNotePlaceholder: "Enter Note",
        headerText: "SFMTA",
        enterNoteButtonText: "Add",
        titleText: "As-Built Viewer",
        securityTitle: 'SENSITIVE SECURITY INFORMATION',
        securityMsg: "WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520.  No part of this record may be disclosed to persons without a 'need to know,' as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation.  Unauthorized release may result in civil penalty or other action.<br/>SFMTA As-Built Design Documents are 'Security Sensitive Information' or 'SSI Documents' and are confidential and protected from public disclosure under federal law, as noted above.<br/>The disclosure of SSI documents to unauthorized persons may cause irreparable damage to the SFMTA, and may threaten or compromise the security of the traveling public, transit employees, or transit infrastructure.<br/>By accessing this program you acknowledge that the disclosure to the public of any documents identified as SSI is against federal law and you agree to abide by the restrictions against disclosure of such documents.</br>Please refer to the SFMTA Statement of Incompatible Activities for more detail regarding prohibited conduct.  Inappropriate use of SFMTA resources may result in discipline, up to and including termination of employment.<br/>For more information, please review the SFMTA Technology Resources Policy available under the Quick Links > IT Support Team tabs on the SFMTA Intranet page.  Continuing means you accept the above conditions.  Press OK when ready.",
        updateTitle: "Application Update",
        updateMsg: "This application has just successfully been updated to the latest version. Reload now?",
        detailsButtonText: "Details",
        notesButtonText: "Notes",
        doneButtonText: "Done",
        notesTextSuffix: "Notes",
        notesItemTitle: "Notes",
        addNoteButtonText: "Add Note",
        facilityNameTitle: "Facility Name",
        projectNumberTitle: "Project Number",
        drawingNumberTitle: "Drawing Number",
        documentTypeTitle: "Document Type",
        drawingDateTitle: "Drawing Date",
        allFilterButtonText: "All",
        mappedFilterButtonText: "Mapped",
        unmappedFilterButtonText: "Unmapped",
        cancelButtonText: "Cancel",
        resetButtonText: "Reset",
        modifySearchButtonText: "Modify Search",
        locationFailedTitle: "Information",
        locationFailedMsg: "Failed to retrieve location",
        locationUncapableTitle: "Information",
        locationUncapableMsg: "This device cannot retrieve location",
        drawingFieldset: "Drawing",
        typeLabel: "Type",
        documentSubjectLabel: "Subject",
        drawingNumberLabel: "Number",
        drawingDateLabel: "Date",
        facilityFieldset: "Facility",
        facilityNameLabel: "Name",
        contractFieldset: "Contract",
        contractNumberLabel: "Number",
        contractTitleLabel: "Title",
        useBBOXLabel: "Use map extent",
        searchButtonText: "Search"
        /* end i18n */
    },
    constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});
