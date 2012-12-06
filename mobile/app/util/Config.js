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

        listItemTpl: '<div class="table-cell col1"><tpl if="feature.attributes.SDRAWTITLE != null">{feature.attributes.SDRAWTITLE}<tpl else>Unknown</tpl></div><div class="table-cell col2"><tpl if="feature.attributes.TYPEDESC != null">{feature.attributes.TYPEDESC}<tpl else>Type unknown</tpl></div><div class="table-cell col3"><tpl if="feature.attributes.DDRAWDATE != null">{feature.attributes.DDRAWDATE}<tpl else>Unknown</tpl></div>',

        featureInfoTpl: '<div class="fp-title"><tpl if="feature.attributes.SDRAWTITLE != null">{feature.attributes.SDRAWTITLE}<tpl else>Title unknown</tpl><span class="follow">&gt;</span></div><div class="fp-container"><div class="fp-type"><tpl if="feature.attributes.TYPEDESC != null">{feature.attributes.TYPEDESC}<tpl else>Type unknown</tpl></div><div class="fp-date"><tpl if="feature.attributes.DDRAWDATE != null">{feature.attributes.DDRAWDATE}<tpl else>Date unknown</tpl></div></div>',

        notesTpl: '<div class="notesNote">{NOTE}</div><div class="notesAuthor">Added {TIMESTAMP:this.formatTS} by {AUTHOR}</div>',

        selectStyle: {
            pointRadius: 12,
            fillColor: 'F98D0C',
            strokeColor: 'E3E3D9',
            strokeWidth: 4
        },

        geolocationOptions: {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 7000
        },

        geolocationStyle: {
            graphicName: 'circle',
            strokeColor: '#ff0000',
            strokeWidth: 1,
            fillOpacity: 0.5,
            fillColor: '#0000ff',
            pointRadius: 8
        },

        geolocationAccuracyStyle: {
            fillColor: '#000',
            fillOpacity: 0.1,
            strokeWidth: 0
        },

        maxFeatures: 100,

        featureInfoBuffer: 15,

        maxFeaturesTpl: 'Your search returned {number}{text} images. Showing the first {first}.',

        drawingsTable: "DOCS",

        facilityNameView: "VW_SFACILITYNAME",

        contractNumberView: "VW_SCONTRACTNUM",

        contractTitleView: "VW_SCONTRACTTITLE",

        notesTable: "NOTES",

        geomField: "GEOM",

        authorField: "AUTHOR",

        noteField: "NOTE",

        documentIdField: "DOC_ID",

        pathField: "PATH",

        documentSubjectField: "DOCSUBJECT",

        fileTypeField: "FILETYPE",

        imageWidthField: "WIDTH",

        imageHeightField: "HEIGHT",

        facilityNameField: "SFACILITYNAME",
        contractNumberField: "SCONTRACTNUM",
        contractTitleField: "SCONTRACTTITLE",
        drawingNumberField: "IDRAWNUM",
        typeDescriptionField: "TYPEDESC",
        drawingDateField: "DDRAWDATE",

        imagesLayer: 'images',

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
