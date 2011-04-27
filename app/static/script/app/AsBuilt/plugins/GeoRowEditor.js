Ext.ns('AsBuilt.plugins');

AsBuilt.plugins.GeoRowEditor = Ext.extend(Ext.ux.grid.RowEditor, {

    addGeometryText: 'Add geometry',
    modifyGeometryText: 'Modify geometry',

    minButtonWidth: 100,

    beforedestroy: function() {
        this.drawControl = null;
        this.modifyControl = null;
        this.feature = null;
        AsBuilt.plugins.GeoRowEditor.superclass.beforedestroy.apply(this, arguments);       
    },

    /** private: method[handleAddGeometry]
     *  Use a DrawFeature Control to add new geometries.
     */
    handleAddGeometry: function() {
        var store = this.grid.store;
        this.feature = this.record.get("feature");
        if (this.drawControl == null) {
            this.drawControl = new OpenLayers.Control.DrawFeature(
                new OpenLayers.Layer.Vector(),
                OpenLayers.Handler.Point, {
                eventListeners: {
                    "featureadded": function(evt) {
                        this.drawControl.deactivate();
                        this.feature.geometry = evt.feature.geometry.clone();
                        this.feature.state =  OpenLayers.State.UPDATE;
                        this.record.set("state", this.feature.state);
                    },
                    scope: this
                }
            });
            this.feature.layer.map.addControl(this.drawControl);
        }
        this.drawControl.activate();
    },

    /** private: method[handleModifyGeometry]
     *  Use a ModifyFeature Control to modify existing geometries.
     */
    handleModifyGeometry: function() {
        var store = this.grid.store;
        this.feature = this.record.get("feature");
        if (this.modifyControl == null) {
            this.modifyControl = new OpenLayers.Control.ModifyFeature(
                this.feature.layer,
                {standalone: true}
            );
            this.feature.layer.map.addControl(this.modifyControl);
        }
        this.modifyControl.activate();
        this.modifyControl.selectFeature(this.feature);
    },

    stopEditing : function(saveChanges){
        this.editing = false;
        if(!this.isVisible()){
            return;
        }
        if(saveChanges === false || !this.isValid()){
            this.hide();
            this.fireEvent('canceledit', this, saveChanges === false);
            return;
        }
        var changes = {},
            r = this.record,
            hasChange = false,
            cm = this.grid.colModel,
            fields = this.items.items;
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            if(!cm.isHidden(i)){
                var dindex = cm.getDataIndex(i);
                if(!Ext.isEmpty(dindex)){
                    var oldValue = r.data[dindex],
                        value = this.postEditValue(fields[i].getValue(), oldValue, r, dindex);
                    if(String(oldValue) !== String(value)){
                        changes[dindex] = value;
                        hasChange = true;
                    }
                }
            }
        }

        // bartvde, additional check if geometry has been modified
        hasChange = hasChange || this.feature.state === OpenLayers.State.UPDATE;

        if(hasChange && this.fireEvent('validateedit', this, changes, r, this.rowIndex) !== false){
            r.beginEdit();
            Ext.iterate(changes, function(name, value){
                r.set(name, value);
            });
            r.endEdit();
            this.fireEvent('afteredit', this, changes, r, this.rowIndex);
        }
        this.hide();
    },

    init: function(grid){
        AsBuilt.plugins.GeoRowEditor.superclass.init.apply(this, arguments);
        this.on('afteredit', function() {
                this.grid.store.save();
                this.modifyControl && this.modifyControl.deactivate();
                this.drawControl && this.drawControl.deactivate();
            }, this);
        this.on('canceledit', function() {
                this.grid.store.commitChanges();
                // restore the original geometry
                this.feature.layer.eraseFeatures([this.feature]);
                this.feature.geometry = this.geometry;
                this.feature.layer.drawFeature(this.feature);
                this.modifyControl && this.modifyControl.deactivate();
                this.drawControl && this.drawControl.deactivate();
            }, this);
        this.on("beforeedit", function(plugin, rowIndex) { 
                var g = this.grid, view = g.getView(),
                    record = g.store.getAt(rowIndex);
                this.geometry = record.get("feature").geometry && record.get("feature").geometry.clone();
                if (this.btns) {
                    if (record.get("feature").geometry === null) {
                        this.btns.items.get(3).hide();
                        this.btns.items.get(2).show();
                    } else {
                        this.btns.items.get(2).hide();
                        this.btns.items.get(3).show();
                    }
                }
                return true;
            }, this);
    },

    beforedestroy: function() {
        AsBuilt.plugins.GeoRowEditor.superclass.beforedestroy.call(this);
    },

    onRender: function(){
        Ext.ux.grid.RowEditor.superclass.onRender.apply(this, arguments);
        this.el.swallowEvent(['keydown', 'keyup', 'keypress']);
        var numButtons = 3;
        this.btns = new Ext.Panel({
            baseCls: 'x-plain',
            cls: 'x-btns',
            elements:'body',
            layout: 'table',
            width: (this.minButtonWidth * numButtons) + (this.frameWidth * numButtons) + (this.buttonPad * numButtons*2), // width must be specified for IE
            items: [{
                ref: 'saveBtn',
                itemId: 'saveBtn',
                xtype: 'button',
                text: this.saveText,
                width: this.minButtonWidth,
                handler: this.stopEditing.createDelegate(this, [true])
            }, {
                xtype: 'button',
                text: this.cancelText,
                width: this.minButtonWidth,
                handler: this.stopEditing.createDelegate(this, [false])
            }, {
                xtype: 'button',
                text: this.addGeometryText,
                handler: this.handleAddGeometry,
                scope: this,
                hidden: (this.record.get("feature").geometry !== null),
                width: this.minButtonWidth
            }, {
                xtype: 'button',
                text: this.modifyGeometryText,
                handler: this.handleModifyGeometry,
                scope: this,
                hidden: (this.record.get("feature").geometry === null),
                width: this.minButtonWidth
            }]
        });
        this.btns.render(this.bwrap);
    }
});
Ext.preg('app_georoweditor', AsBuilt.plugins.GeoRowEditor);
