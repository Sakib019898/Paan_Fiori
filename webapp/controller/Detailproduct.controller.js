sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("sap.ui.demo.products.controller.Detailproduct", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detailproduct").attachPatternMatched(this._onObjectMatched, this);
            
        },
        _onObjectMatched: function (oEvent) {
			this.getView().bindElement({
				path: "/Products(" + oEvent.getParameter("arguments").productPath+")",
				model: "invoice"
			});
            var oModel = this.getOwnerComponent().getModel("invoice");
            var that=this;
            this.getView().byId("button").setText("Edit Rating!");
            this.getView().byId("rating").setEditable(false);
            oModel.read("/Products("+oEvent.getParameter("arguments").productPath+")", {
                success: function (odata) {
                    that.getView().byId("detail").setTitle(odata.Name);
                    that.getView().byId("detail").setIntro(odata.Description);
                    that.getView().byId("rating").setValue(odata.Rating);
                },
                error: function (oError) {
                    console.log(oError);
                }
            });
		},
        getItemNo:function(path){
            var str="";
            var j=0;
            for(var i=0; i<path.length;i++){
               if(path[i]==')') break;
               else if(path[i]=='(') j=1;
               else if(j==1){
                str+=path[i];
               }
            }
            return  parseInt(str);
        },
        editOdata: function () {
           var str = this.getView().byId("button").getText();

           if(str==="Edit Rating!"){
               this.getView().byId("button").setText("Submit");
               this.getView().byId("rating").setEditable(true);

           }
           else{
            var val = this.getView().byId("rating").getValue();
            var path = this.getView().mObjectBindingInfos.invoice.path;
            var oModel = this.getOwnerComponent().getModel("invoice");
            oModel.setUseBatch(false);
            var that=this;
            oModel.update(path,{Rating:val},{
                success: function (odata) {
                    that.getView().byId("rating").setValue(val);
                    that.getView().byId("button").setText("Edit Rating!");
                    that.getView().byId("rating").setEditable(false);
                    MessageToast.show("New Rating of "+that.getView().byId("detail").getTitle()+" is "+val );
                },
                error: function (oError) {
                    console.log(oError);
                }
            });

           }
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("product");
        }

    });
});