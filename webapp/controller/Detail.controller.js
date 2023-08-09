sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller){
	"use strict";

	return Controller.extend("sap.ui.demo.products.controller.Detail", {
        onInit: function (){
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
		},
		_onProductMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			this.getView().bindElement({
				path: "/ProductCollection/" + this._product,
				model: "products"
			});
			this.getView().byId("iconTabBar").setSelectedKey("show");
			this.onTabCall("notShow");
		},
		onEditToggleButtonPress: function(show) {
			var oObjectPage = this.getView().byId("ObjectPageLayout");
			oObjectPage.setShowFooter(show);
		},    
		handleFullScreen: function () {
			// var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			var sNextLayout = "MidColumnFullScreen";
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},

		handleExitFullScreen: function () {
			var sNextLayout = "TwoColumnsBeginExpanded";
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},

		handleClose: function () {
			var sNextLayout = "OneColumn";
			this.oRouter.navTo("master", {layout: sNextLayout});
		},
		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		},
		onTabSelect : function(oEvent){
			var sSelectedTab = oEvent.getParameter("selectedKey");
			this.onTabCall(sSelectedTab);		
		},
		onTabCall : function(str){
            if(str==="edit"){
				let id;
				for(var i=2;i<10;i++){
                    id=i.toString();
				    this.getView().byId(id).setEditable(true);
					this.getView().byId("button_"+id).setVisible(true);	
					this.onEditToggleButtonPress(true); 
				}
			}else{
				let id;
				for(var i=2;i<10;i++){
                    id=i.toString();
				    this.getView().byId(id).setEditable(false);
					this.getView().byId("button_"+id).setVisible(false);
					this.onEditToggleButtonPress(false);	
				}
			}
			
		},
		del_2: function(){
            this.getView().byId("2").setValue("");
		},
		del_3: function(){
            this.getView().byId("3").setValue("");
		},
		del_4: function(){
            this.getView().byId("4").setValue("");
		},
		del_5: function(){
            this.getView().byId("5").setValue("");
		},
		del_6: function(){
            this.getView().byId("6").setValue("");
		},
		del_7: function(){
            this.getView().byId("7").setValue("");
		},
		del_8: function(){
            this.getView().byId("8").setValue("");
		},
		del_9: function(){
            this.getView().byId("9").setValue("");
		},
		update: function(){
			 var oModel = this.getView().getModel("products").oData;
			 var oModelObject = oModel.ProductCollection;
			 
			 for(var i=0;i<oModelObject.length;i++){
                 if(oModelObject[i].ProductId==this.getView().byId("1").getValue()){
					oModelObject[i].SupplierName  =  this.getView().byId("3").getValue();
					oModelObject[i].WeightMeasure =  this.getView().byId("6").getValue();
					oModelObject[i].Description   =  this.getView().byId("2").getValue();
					oModelObject[i].DateOfSale    =  this.getView().byId("4").getValue();
					oModelObject[i].Quantity      =  this.getView().byId("5").getValue();
					oModelObject[i].Width         =  this.getView().byId("7").getValue();
					oModelObject[i].Depth         =  this.getView().byId("8").getValue();
					oModelObject[i].Height        =  this.getView().byId("9").getValue();
					break;
				 }
			 }
			oModel.ProductCollection = oModelObject;
            // oModel.bindElement("/ProductCollection",oModelObject);
			this.getView().setModel(new sap.ui.model.json.JSONModel(oModel),"products");		
            this.getView().getModel("products").refresh();	
			this.getView().byId("iconTabBar").setSelectedKey("show");
            this.onTabCall("show");
		},
		cancel: function(){
			var oModel = this.getView().getModel("products").oData;
			 var oModelObject = oModel.ProductCollection;
			 
			 for(var i=0;i<oModelObject.length;i++){
                 if(oModelObject[i].ProductId==this.getView().byId("1").getValue()){
					this.getView().byId("3").setValue(oModelObject[i].SupplierName);
					this.getView().byId("6").setValue(oModelObject[i].WeightMeasure);
				    this.getView().byId("2").setValue(oModelObject[i].Description);
					this.getView().byId("4").setValue(oModelObject[i].DateOfSale);
					this.getView().byId("5").setValue(oModelObject[i].Quantity);
					this.getView().byId("7").setValue(oModelObject[i].Width);
					this.getView().byId("8").setValue(oModelObject[i].Depth);
					this.getView().byId("9").setValue(oModelObject[i].Height);
					break;
				 }
			 }
			this.getView().byId("iconTabBar").setSelectedKey("show");
            this.onTabCall("show");
		}

	});
});