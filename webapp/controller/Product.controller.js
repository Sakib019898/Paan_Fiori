sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
], function (Controller,Filter, FilterOperator, Sorter,) {
    "use strict";
    return Controller.extend("sap.ui.demo.products.controller.Product", {
        onInit: function () {

            this.onReadAll();
        },
        onReadAll: function () {
            var that = this;
            var oModel = this.getOwnerComponent().getModel("invoice");

            oModel.read("/Products", {
                success: function (odata) {
                    var JModel = new sap.ui.model.json.JSONModel(odata);
                    that.getView().byId("idProducts").setModel(JModel);
                    that.getView().byId("idProducts_del").setModel(JModel);
                },
                error: function (oError) {
                    console.log(oError);
                }
            });
        },
        onPress: function (oEvent) {
            
            var spath= oEvent.getSource().getBindingContext().sPath;
            spath=spath.substr(1,spath.length-1);
            var indexOfSlash = spath.indexOf('/');
            var index="";
            for(var i=indexOfSlash+1;i<spath.length;i++){
                index+=spath[i];
            }
            var path = oEvent.getSource().getBindingContext().oModel.oData.results[parseInt(index)].ID;
            this.getOwnerComponent().getRouter().navTo("detailproduct",{
                productPath: path
            });
        },
        onNavLocal: function () {
            this.getOwnerComponent().getRouter().navTo("home");
        },onCancel:function(){
            this.getView().byId("oDialogCreate").setVisible(true).close();
        },
        onCreate: function (){
           
            this.getView().byId("oDialogCreate").setVisible(true).open();

            var res = this.getView().byId("idProducts").getModel().oData.results;
            var n = res.length;
            this.getView().byId("productId").setValue(n);
            
        },
        onAccept: function (){
            var res = this.getView().byId("idProducts").getModel().oData.results;
            var n = res.length;
            var newData; 
            if(n-1>=0){
                newData = res[n-1];
            }
            newData.ID = this.getView().byId("productId").getValue();
            newData.Name = this.getView().byId("productName").getValue();
            newData.Description =this.getView().byId("productDes").getValue();
            newData.Price = this.getView().byId("productPrice").getValue();
            newData.Rating = this.getView().byId("productRating").getValue();

            var that = this;
            var oModel = this.getOwnerComponent().getModel("invoice");
            oModel.setUseBatch(false);

            oModel.create("/Products",newData, {
                success: function (odata) {
                    that.onReadAll();
                    that.getView().byId("oDialogCreate").setVisible(true).close();
                    that.getView().byId("productId").setValue("");
                    that.getView().byId("productName").setValue("");
                    that.getView().byId("productDes").setValue("");
                    that.getView().byId("productPrice").setValue("");
                    that.getView().byId("productRating").setValue("");
                },
                error: function (oError) {
                    console.log(oError);
                }
            });

        },
        onDelete: function (){
            this.getView().byId("idProducts").setVisible(false);
            this.getView().byId("idProducts_del").setVisible(true);
        },
        onEditCancel: function (){
            this.getView().byId("idProducts_del").setVisible(false);
            this.getView().byId("idProducts").setVisible(true);
        },
        onTableDelete: function (oEvent){
            var spath= oEvent.getSource().getBindingContext().sPath;
            spath=spath.substr(1,spath.length-1);
            var indexOfSlash = spath.indexOf('/');
            var index="";
            for(var i=indexOfSlash+1;i<spath.length;i++){
                index+=spath[i];
            }
            var path = oEvent.getSource().getBindingContext().oModel.oData.results[parseInt(index)].ID;
            var that = this;
            var oModel = this.getOwnerComponent().getModel("invoice");
            oModel.setUseBatch(false);

            oModel.remove("/Products("+path+")", {
                success: function (odata) {
                    that.onReadAll();
                },
                error: function (oError) {
                    console.log(oError);
                }
            });
        },
        onSort: function (){
            if (!this.pDialog) {
				this.pDialog = this.loadFragment({
					name: "sap.ui.demo.products.view.OdataSortDialog"
				});
			} 
			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});
            
        },
        onFilter: function (){
            if (!this.pDialogFilter) {
                this.pDialogFilter = this.loadFragment({
                    name: "sap.ui.demo.products.view.OdataFilterDialog"
                });
            } 
            this.pDialogFilter.then(function(oDialog) {
                oDialog.open();
            });

        },
        onConfirmSort: function (){
            this._bDescendingSort = this.getView().byId("sortDialog").mProperties.sortDescending;
			var val = this.getView().byId("sortDialog").mAssociations.selectedSortItem;
			var oSorter;
			if(val.charAt(val.length-2)==='i'){
                oSorter = new Sorter("ID", this._bDescendingSort);
			}
			else if(val.charAt(val.length-2)==='c'){
                oSorter = new Sorter("Price", this._bDescendingSort);
                oSorter.fnCompare = function(value1, value2) {
                    value2 = parseFloat(value2);
                    value1 = parseFloat(value1);
                    
                    if (value1 < value2) return -1;
                    if (value1 == value2) return 0;
                    if (value1 > value2) return 1;

                    };
			}
			else if(val.charAt(val.length-2)==='m'){
                oSorter = new Sorter("Name", this._bDescendingSort);
			}
            // var that = this;
            // var oModel = this.getOwnerComponent().getModel("invoice");
            // oModel.read("/Products", {
            //     sorters:[oSorter],
            //     success: function (odata) {
            //         var JModel = new sap.ui.model.json.JSONModel(odata);
            //         that.getView().byId("idProducts").setModel(JModel);
            //         that.getView().byId("idProducts_del").setModel(JModel);
            //     },
            //     error: function (oError) {
            //         console.log(oError);
            //     }
            // });
            this.getView().byId("idProducts").getBinding("items").sort(oSorter);
            this.getView().byId("idProducts_del").getBinding("items").sort(oSorter);
        },
        getOperatorFilter: function() {
			var oFilter;
			if(this.getView().byId("le").mProperties.selected){
                oFilter = new Filter("Price", FilterOperator.LE, 20.0);
			}
			else if(this.getView().byId("lt").mProperties.selected){
                oFilter = new Filter("Price", FilterOperator.LT, 20.0);
			}
			else if(this.getView().byId("ge").mProperties.selected){
                oFilter = new Filter("Price", FilterOperator.GE, 20.0);
			}
			else if(this.getView().byId("gt").mProperties.selected){
                oFilter = new Filter("Price", FilterOperator.GT, 20.0);
			}
			else oFilter = new Filter("Price", FilterOperator.EQ, 20.0);
			
            return oFilter;
		  },
        onConfirmFilter: function () {
            var oTableSearchState = [];
			 var doSearch = true;
			 if(!this.getView().byId("le").mProperties.selected &&
				!this.getView().byId("lt").mProperties.selected &&
				!this.getView().byId("ge").mProperties.selected &&
				!this.getView().byId("gt").mProperties.selected &&
				!this.getView().byId("eq").mProperties.selected
				) doSearch=false;
             
			if(doSearch){	
			oTableSearchState = new Filter({
						filters: [
							 this.getOperatorFilter(),
							],
						  and: true,
					});	
				}
        
            this.getView().byId("idProducts").getBinding("items").filter(oTableSearchState, "Application");
            this.getView().byId("idProducts_del").getBinding("items").filter(oTableSearchState, "Application");

        },
        onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			}

			this.getView().byId("idProducts").getBinding("items").filter(oTableSearchState, "Application");
            this.getView().byId("idProducts_del").getBinding("items").filter(oTableSearchState, "Application");
		},
    });
});