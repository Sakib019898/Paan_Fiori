sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("sap.ui.demo.products.controller.Startpage", {
		onInit: function () {
			
		},
    onNavLocal:function(){
      this.getRouter().navTo("itempage");
    },
    onNavToOdata:function(){
      this.getRouter().navTo("product");
    },
    getRouter: function () {
			return this.getOwnerComponent().getRouter();
		}
    });
});