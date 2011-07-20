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
 *    Show preview of image warping and have an option to save 
 *    the rectified image.
 */
AsBuilt.plugins.GCPImagePreview = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_preview */
    ptype: "app_preview",

    /**
     * api: config[basePath]
     * ``String`` The base path on the server at which rectified images will 
     * be saved.
     */
    basePath: null,

    /**
     * api: config[opacitySlider]
     * ``String`` The id of the opacity slider.
     */
    opacitySlider: null,

    /** api: config[baseMap]
     *  ``OpenLayers.Map`` The base map to which the preview layer should be
     *  added.
     */
    baseMap: null,

    /** api: config[url]
     *  ``String`` The url of the geoserver which is to be used as the back-end
     *  for previewing and warping the images.
     */
    url: null,

    /** api: config[layerName]
     *  ``String`` The name of the WMS layer that holds the images.
     */
    layerName: null,

    /** api: config[styleName]
     *  ``String`` The name of the style that can be used for previewing the
     *  image. This style should have a featureTypeStyle with a properly
     *  defined gs:ImageRectify Function.
     */
    styleName: null,

    /** private: previewLayer
     *  ``OpenLayers.Layer.WMS`` The WMS layer used for previewing the image
     *  which is to be rectifier.
     */
    previewLayer: null,

    /** api: config[gcpManager]
     * ``AsBuilt.GCPManager`` The GCP Manager, needed to know when
     * to enable/disable this tool and to retrieve the list of ground
     * control points.
     */
    gcpManager: null,

    /**
     * api: config[targetCRS]
     * ``OpenLayers.Projection`` The projection in which the warped image is to
     * be saved. Since the ImageCollection store currently does not support
     * reprojection, this needs to be the projection of the base map, and
     * apparently GDAL has issues with EPSG:900913 so use the more official
     * EPSG code (EPSG:3857).
     */
    targetCRS: new OpenLayers.Projection("EPSG:3857"),

    /* start i18n */
    previewTooltip: "Preview warped image",
    previewText: "Preview",
    saveTooltip: "Save the warped image",
    saveText: "Save",
    saveWaitMsg: "Please wait while saving image, this can take around 1 minute to complete",
    /* end i18n */

    /**
     * private: method[enableButton]
     *
     * :param mgr: ``AsBuilt.GCPManager``
     * :param count: ``Integer`` Number of Ground Control Points
     */
    enableButton: function(mgr, count) {
        Ext.each(this.actions, function(action) {
            action.setDisabled(count < 3);
        });
    },

    /**
     * private: method[getEnv]
     * Gets the array/list of GCPs to use in the WMS GetMap and the WPS
     * Execute request.
     * 
     * :return: ``String`` The encoded list of GCPs
     */
    getEnv: function() {
        var gcps = this.gcpManager.getGCPs();
        var env = "[";

        var encodeGeometry = function(geom, roundAndFlipY) {
            var result = "[";
            if (roundAndFlipY === true) {
                result += Math.round(geom.x);
            } else {
                result += geom.x;
            }
            result += ", ";
            if (roundAndFlipY === true) {
                result += -Math.round(geom.y);
            } else {
                result += geom.y;
            }
            result += "]";
            return result;
        };

        var encodeGCP = function(gcp) {
            var result = "[";
            result += encodeGeometry(gcp.source.geometry, true);
            result += ", ";
            result += encodeGeometry(gcp.target.geometry, false);
            result += "]";
            return result;
        };

        for (var i=0,ii=gcps.length; i<ii; ++i) {
            env += encodeGCP(gcps[i]);
            if (i<ii-1) {
                env += ",";
            }
        }

        env += "]";
        return env;
    },

    /**
     * private: method[previewImage]
     *
     * Show a preview of the warped image on top of the base map.
     */
    previewImage: function() {
        var map = this.baseMap;
        var params = {
            CQL_FILTER: "PATH='"+this.target.imageInfo.path+"'",
            ENV: 'gcp:' + this.getEnv()
        };
        if (!this.previewLayer) {
            OpenLayers.Util.extend(params, {
                layers: this.layerName, 
                styles: this.styleName, 
                format: 'image/png'
            });
            this.previewLayer = new OpenLayers.Layer.WMS(null, this.url, 
                params, {
                    projection: this.targetCRS, 
                    singleTile: true, 
                    ratio: 1
                }
            );
            map.addLayer(this.previewLayer);
            // attach the preview layer to the opacity slider
            if (this.opacitySlider !== null) {
                var slider = Ext.getCmp(this.opacitySlider);
                if (slider) {
                    slider.setLayer(this.previewLayer);
                }
            }
        } else {
            this.previewLayer.mergeNewParams(params);
        }
    },

    /**
     * private: method[saveImage]
     * Save the rectified image on the server. The WPS process will return the
     * file path in which the image was saved.
     */
    saveImage: function() {
        if (!this.loadMask) {
            this.loadMask = new Ext.LoadMask(Ext.getBody(), 
                {msg: this.saveWaitMsg});
        }
        this.loadMask.show();
        // build up the WPS Execute request
        var format = new OpenLayers.Format.WPSExecute();
        var request = format.write({
            identifier: "gs:GeorectifyCoverage", 
            dataInputs: [{
                identifier: 'data',
                reference: {
                    mimeType: "image/tiff",
                    /* This special syntax references the local GeoServer */
                    href: "http://geoserver/wps?", 
                    method: "POST",
                    body: {
                        identifier: 'gs:GetFullCoverage',
                        dataInputs: [{
                            identifier: 'name',
                            data: {
                                literalData: {
                                    value: this.layerName
                                }
                            }
                        }, {
                            identifier: 'filter',
                            data: {
                                complexData: {
                                    mimeType: 'text/plain; subtype=cql',
                                    value: "path = '" + this.target.imageInfo.path + "'"
                                }
                            }
                        }],
                        responseForm: {
                            rawDataOutput: {
                                mimeType: "image/tiff",
                                identifier: "result"
                            }
                        }
                    }
                }
            }, {
                identifier: 'gcp',
                data: {
                    literalData: {
                        value: this.getEnv()
                    }
                }
            }, {
                identifier: 'targetCRS',
                data: {
                    literalData: {
                        value: this.targetCRS.getCode()
                    }
                }
            }, {
                identifier: 'transparent',
                data: {
                    literalData: {
                        value: 'true'
                    }
                }
            }, {
                identifier: 'store',
                data: {
                    literalData: {
                        value: 'true'
                    }
                }
            }, {
                identifier: 'outputPath',
                data: {
                    literalData: {
                        value: this.basePath + this.target.imageInfo.path
                    }
                }
            }],
            responseForm: {
                rawDataOutput: {
                    mimeType: "text/plain",
                    identifier: "path"
                }
            }
        });

        OpenLayers.Request.POST({
            url: this.url,
            data: request,
            success: function(response) {
                var path = response.responseText;
                this.updateRecord(path);
            },
            scope: this
        });

    },

    /**
     * private: method[updateRecord]
     *
     * :param path: ``String`` The file path on which the image was saved.
     *
     * Update the record in the DOCS table with the file path.
     */
    updateRecord: function(path) {
        // TODO decide whether or not we still want to keep using the name layer
        var feature = new OpenLayers.Feature.Vector(null, {LAYER: path});
        feature.fid = this.target.imageInfo.fid;
        feature.state = OpenLayers.State.UPDATE;
        var options = {
            callback: function(response) {
                this.loadMask.hide();
            },
            scope: this
        };
        if (!this.featureStore) {
            this.featureStore = new gxp.data.WFSFeatureStore({
                fields: [{name: 'LAYER'}],
                url: this.url,
                geometryName: null,
                featureType: this.featureType,
                featureNS: this.featureNS
            });
        }
        this.featureStore.proxy.protocol.commit([feature], options);
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
                handler: this.previewImage,
                scope: this,
                text: this.previewText
            }, {
                tooltip: this.saveTooltip,
                iconCls: "gxp-icon-save",
                handler: this.saveImage,
                scope: this,
                disabled: true,
                text: this.saveText
            }
        ]);
    }

});

Ext.preg(AsBuilt.plugins.GCPImagePreview.prototype.ptype, AsBuilt.plugins.GCPImagePreview);
