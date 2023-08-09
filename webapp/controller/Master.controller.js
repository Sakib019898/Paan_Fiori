sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageBox",
	'sap/f/library',
	"sap/ui/core/Fragment"
], function (Controller, Filter, FilterOperator, Sorter, MessageBox, fioriLibrary,Fragment) {
    "use strict";
    return Controller.extend("sap.ui.demo.products.controller.Master", {
		onInit: function () {
		this.oView = this.getView();
		this._bDescendingSort = false;
		this.oProductsTable = this.oView.byId("productsTable");
		this.oRouter = this.getOwnerComponent().getRouter();
		this.getView().byId("oDialogCreate").setVisible(true).open();
		this.getView().byId("oDialogCreate").setVisible(true).close();
		},
    onNavLocal:function(){
        this.getOwnerComponent().getRouter().navTo("home");
    },
	onCreate: function (){
        var oModelObject = this.getView().getModel("products").oData.ProductCollection;
		var i = 1000 + oModelObject.length;
		var newProductId = i.toString();

		this.getView().byId("oDialogCreate").setTitle("Create PAAN");
		this.getView().byId("PaanId").setValue(newProductId);
		this.getView().byId("PaanName").setValue(oModelObject.Name);
		this.getView().byId("PaanDes").setValue("");
		this.getView().byId("PaanPrice").setValue("");
		this.getView().byId("PaanSupplier").setValue("");
		this.getView().byId("SupplyDate").setValue("");
		this.getView().byId("Qty").setValue("");
		this.getView().byId("Weight").setValue("");
		this.getView().byId("Width").setValue("");
		this.getView().byId("Depth").setValue("");
		this.getView().byId("Height").setValue("");
		this.getView().byId("oDialogCreate").setVisible(true).open();
	},
	onTableEdit:function(oEvent){
		var productPath = oEvent.getSource().getBindingContext("products").getPath(),
		productIndex = productPath.split("/").slice(-1).pop();
		var oModelObject = this.getView().getModel("products").oData.ProductCollection[productIndex];
		
		this.getView().byId("oDialogCreate").setTitle("Edit PAAN");
		this.getView().byId("PaanId").setValue(oModelObject.ProductId);
		this.getView().byId("PaanName").setValue(oModelObject.Name);
		this.getView().byId("PaanDes").setValue(oModelObject.Description);
		this.getView().byId("PaanPrice").setValue(oModelObject.Price);
		this.getView().byId("PaanSupplier").setValue(oModelObject.SupplierName);
		this.getView().byId("ct").setSelectedKey(oModelObject.Category);
		this.getView().byId("SupplyDate").setValue(oModelObject.DateOfSale);
		this.getView().byId("Qty").setValue(oModelObject.Quantity);
		this.getView().byId("Weight").setValue(oModelObject.WeightMeasure);
		this.getView().byId("Width").setValue(oModelObject.Width);
		this.getView().byId("Depth").setValue(oModelObject.Depth);
		this.getView().byId("Height").setValue(oModelObject.Height);

		this.getView().byId("oDialogCreate").setVisible(true).open();

	},
	onTableDelete:function(oEvent){
		var productPath = oEvent.getSource().getBindingContext("products").getPath(),
		productIndex = productPath.split("/").slice(-1).pop();
		
		var oModel = this.getView().getModel("products").oData;
		var oModelObject = oModel.ProductCollection;
		var showObj = oModelObject[productIndex];

		MessageBox.information("Are you sure you want to delete "+showObj.Name+" ?", {title: "Delete "+showObj.ProductId+" !"});
	
		oModelObject.splice(productIndex, 1);
		oModel.ProductCollection = oModelObject;
		this.getView().setModel(new sap.ui.model.json.JSONModel(oModel),"products");		
		this.getView().getModel("products").refresh();
		this.getView().byId("oDialogCreate").setVisible(true).close();
	},
	onCancel:function(){
		this.getView().byId("oDialogCreate").setVisible(true).close();
	},
	switchLastColumn:function(instruct,col){
        if(instruct=="On" && col==1){
			this.getView().byId("actionCol").setVisible(true);
			this.getView().byId("actions").setVisible(true);
			this.getView().byId("actionCol2").setVisible(false);
			this.getView().byId("actions2").setVisible(false);
		}
		else if((instruct=="On" && col==2)){
			this.getView().byId("actionCol").setVisible(false);
			this.getView().byId("actions").setVisible(false);
			this.getView().byId("actionCol2").setVisible(true);
			this.getView().byId("actions2").setVisible(true);
		}
		else{
			this.getView().byId("actionCol").setVisible(false);
			this.getView().byId("actions").setVisible(false);
			this.getView().byId("actionCol2").setVisible(false);
			this.getView().byId("actions2").setVisible(false);
		}
	},
	onEdit:function(){
        // this.switchLastColumn("On",1);
		
		this.getView().byId("productsTable").setVisible(false);
		this.getView().byId("productsTable3").setVisible(false);
		this.getView().byId("productsTable2").setVisible(true);
		
	},
	onDelete:function(){
		this.getView().byId("productsTable").setVisible(false);
		this.getView().byId("productsTable2").setVisible(false);
		this.getView().byId("productsTable3").setVisible(true);	
    },
	onEditCancel:function(){
		this.getView().byId("productsTable").setVisible(true);
		this.getView().byId("productsTable2").setVisible(false);
		this.getView().byId("productsTable3").setVisible(false);	
    },
    onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			}

			this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
			this.oView.byId("productsTable2").getBinding("items").filter(oTableSearchState, "Application");
			this.oView.byId("productsTable3").getBinding("items").filter(oTableSearchState, "Application");
		},
    onAdd: function () {
		if (!this.pDialogFilter) {
			this.pDialogFilter = this.loadFragment({
				name: "sap.ui.demo.products.view.FilterSettingsDialog"
			});
		} 
		this.pDialogFilter.then(function(oDialog) {
			oDialog.open();
		});

		},
		getOperatorFilter: function() {
			
			if(this.getView().byId("le").mProperties.selected){
                return new Filter("Price", FilterOperator.LE, "15");
			}
			else if(this.getView().byId("lt").mProperties.selected){
                return new Filter("Price", FilterOperator.LT, "15");
			}
			else if(this.getView().byId("ge").mProperties.selected){
                return new Filter("Price", FilterOperator.GE, "15");
			}
			else if(this.getView().byId("gt").mProperties.selected){
                return new Filter("Price", FilterOperator.GT, "15");
			}
			return new Filter("Price", FilterOperator.EQ, "15");
			
		  },
		getCategoryFilters: function() {

            var ofilter = [];

			if(this.getView().byId("paanCat").mProperties.selected){
				ofilter.push( new sap.ui.model.Filter("MainCategory", FilterOperator.Contains, "Paan"));
			}
			if(this.getView().byId("biriCat").mProperties.selected){
				ofilter.push( new sap.ui.model.Filter("MainCategory", FilterOperator.Contains, "Biri"));
			}
			if(this.getView().byId("teaCat").mProperties.selected){
				ofilter.push( new sap.ui.model.Filter("MainCategory", FilterOperator.Contains, "Tea"));
			}
			return new Filter({
			  filters: ofilter,
			  and: false,
			});
		  },
		onConfirmFilter:function(){
			 var oTableSearchState = [];
			 var doSearch = true;
			 if(!this.getView().byId("paanCat").mProperties.selected &&
			    !this.getView().byId("biriCat").mProperties.selected &&
				!this.getView().byId("teaCat").mProperties.selected &&
				!this.getView().byId("le").mProperties.selected &&
				!this.getView().byId("lt").mProperties.selected &&
				!this.getView().byId("ge").mProperties.selected &&
				!this.getView().byId("gt").mProperties.selected &&
				!this.getView().byId("eq").mProperties.selected
				) doSearch=false;
             
			if(doSearch){	
			oTableSearchState = new Filter({
						filters: [
							 this.getCategoryFilters(),
							 this.getOperatorFilter(),
							],
						  and: true,
					});	
				}
			this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
			this.oView.byId("productsTable2").getBinding("items").filter(oTableSearchState, "Application");
			this.oView.byId("productsTable3").getBinding("items").filter(oTableSearchState, "Application");
		},
        onConfirmSort:function(){
            
            this._bDescendingSort = this.getView().byId("sortDialog").mProperties.sortDescending;
			var oBinding = this.oProductsTable.getBinding("items");
			var val = this.getView().byId("sortDialog").mAssociations.selectedSortItem;
			var oSorter;
			if(val.charAt(val.length-2)==='i'){
                oSorter = new Sorter("ProductId", this._bDescendingSort);
			}
			else if(val.charAt(val.length-2)==='c'){
                oSorter = new Sorter("Price", this._bDescendingSort);
			}
			else if(val.charAt(val.length-2)==='m'){
                oSorter = new Sorter("Name", this._bDescendingSort);
			}
			oBinding.sort(oSorter);
			this.oView.byId("productsTable2").getBinding("items").sort(oSorter);
		    this.oView.byId("productsTable3").getBinding("items").sort(oSorter);
		},
		onSort: function () {
			
			if (!this.pDialog) {
				this.pDialog = this.loadFragment({
					name: "sap.ui.demo.products.view.ViewSettingsDialog"
				});
			} 
			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});

		},
		onCloseDialog : function () {
			// note: We don't need to chain to the pDialog promise, since this event-handler
			// is only called from within the loaded dialog itself.
			this.byId("helloDialog").close();
		},
		onListItemPress: function (oEvent) {
			var productPath = oEvent.getSource().getBindingContext("products").getPath(),
				product = productPath.split("/").slice(-1).pop();

			this.oRouter.navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, product: product});
		},
		onAccept: function (oEvent) {
		
			var oModel = this.getView().getModel("products").oData;
			var oModelObject = oModel.ProductCollection;

       if(this.getView().byId("oDialogCreate").getTitle()=="Create PAAN"){			
			var newData={
				"ProductId":     this.getView().byId("PaanId").getValue(),
		     	"Category":      this.getView().byId("ct").getSelectedKey(),
				"MainCategory":  this.getView().byId("ct").getSelectedKey(),
				"TaxTarifCode":  "1",
				"SupplierName":  this.getView().byId("PaanSupplier").getValue(),
				"WeightMeasure": this.getView().byId("Weight").getValue(),
				"WeightUnit":    "EA",
				"Description":   this.getView().byId("PaanDes").getValue(),
				"Name":          this.getView().byId("PaanName").getValue(),
				"DateOfSale":    this.getView().byId("SupplyDate").getValue(),
				"ProductPicUrl": "images/maruf.jpeg",
				"Status":        "Available",
				"Quantity":      this.getView().byId("Qty").getValue(),
				"UoM":           "PC",
				"CurrencyCode":  "BDT",
				"Price":         this.getView().byId("PaanPrice").getValue(),
				"Width":         this.getView().byId("Width").getValue(),
				"Depth":         this.getView().byId("Depth").getValue(),
				"Height":        this.getView().byId("Height").getValue(),
				"DimUnit":       "cm"
			};
		   oModelObject.push(newData);	
		   
		}
		else{

			for(var i=0;i<oModelObject.length;i++){
				if(oModelObject[i].ProductId==this.getView().byId("PaanId").getValue()){
				   oModelObject[i].SupplierName  =  this.getView().byId("PaanSupplier").getValue();
				   oModelObject[i].WeightMeasure =  this.getView().byId("Weight").getValue();
				   oModelObject[i].Description   =  this.getView().byId("PaanDes").getValue();
				   oModelObject[i].Name          =  this.getView().byId("PaanName").getValue()  
				   oModelObject[i].DateOfSale    =  this.getView().byId("SupplyDate").getValue();
				   oModelObject[i].Quantity      =  this.getView().byId("Qty").getValue();
				   oModelObject[i].Price         =  this.getView().byId("PaanPrice").getValue();
				   oModelObject[i].Width         =  this.getView().byId("Width").getValue();
				   oModelObject[i].Depth         =  this.getView().byId("Depth").getValue();
				   oModelObject[i].Height        =  this.getView().byId("Height").getValue();
				   break;
				}
			}
		}
		   oModel.ProductCollection = oModelObject;
		   this.getView().setModel(new sap.ui.model.json.JSONModel(oModel),"products");		
		   this.getView().getModel("products").refresh();
		   this.getView().byId("oDialogCreate").setVisible(true).close();
		}
    });
});