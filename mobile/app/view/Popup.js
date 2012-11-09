Ext.define("AsBuilt.view.Popup",{
    extend: 'GXM.widgets.FeaturePopup',
    alias: 'widget.app_popup',
    initialize:function(){
        this.callParent();
        this.map = Ext.Viewport.down('app_map').getMap();
        this.map.events.on({
            "move" : this.onMapMove,
            scope : this
        });
        this.location = this.getFeature().geometry.getBounds().getCenterLonLat();
        var mapExtent =  this.map.getExtent();
        if (mapExtent && this.location) {
            this.insideViewport = mapExtent.containsLonLat(this.location);
        }
        this.on('show', this.position, this);
    },

    applyFeature: function(feature) {
        this.callParent(arguments);
        this.location = feature.geometry.getBounds().getCenterLonLat();
        this.map && this.position();
    },

    onMapMove: function() {
        if (!(this.getHidden() && this.insideViewport)){
            this._mapMove = true;
            this.position();
            delete this._mapMove;
        }
        this.position();
    },

    position: function() {
        var me = this;
        if(me._mapMove === true) {
            me.insideViewport = me.map.getExtent().containsLonLat(me.location);
            if(me.insideViewport === me.getHidden()) {
                me.setHidden(!me.insideViewport);
            }
        }
        if(!me.getHidden()) {
            var locationPx = me.map.getPixelFromLonLat(me.location),
                mapBox = Ext.fly(me.map.div).getBox(true),
                y = locationPx.y + mapBox.y,
                x = locationPx.x + mapBox.x,
                elSize = this.element.getSize();
            if (locationPx.x > mapBox.width / 2) {
                // right
                x -= elSize.width;
            }
            if (locationPx.y > mapBox.height / 2) {
                // bottom
                y -= elSize.height;
            }
            me.setLeft(x);
            me.setTop(y);
        }
    },

    panIntoView: function() {
        var mapBox = Ext.fly(this.map.div).getBox(true);
        //assumed viewport takes up whole body element of map panel
        var popupPos =  [this.getLeft(), this.getTop()];
        popupPos[0] -= mapBox.x;
        popupPos[1] -= mapBox.y;
        var panelSize = [mapBox.width, mapBox.height]; // [X,Y]
        var popupSize = [this.getWidth(), this.getHeight()];
        var newPos = [popupPos[0], popupPos[1]];
        //For now, using native OpenLayers popup padding.  This may not be ideal.
        var padding = this.map.paddingForPopups;
        // X
        if(popupPos[0] < padding.left) {
            newPos[0] = padding.left;
        } else if(popupPos[0] + popupSize[0] > panelSize[0] - padding.right) {
            newPos[0] = panelSize[0] - padding.right - popupSize[0];
        }
        // Y
        if(popupPos[1] < padding.top) {
            newPos[1] = padding.top;
        } else if(popupPos[1] + popupSize[1] > panelSize[1] - padding.bottom) {
            newPos[1] = panelSize[1] - padding.bottom - popupSize[1];
        }
        var dx = popupPos[0] - newPos[0];
        var dy = popupPos[1] - newPos[1];
        this.map.pan(dx, dy);
        this.setLeft(newPos[0]+mapBox.x);
        this.setTop(newPos[1]+mapBox.y);
    }

});
