sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
 ], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("sap.ui.demo.products.controller.App", {
      onInit : function () {
       },
    //    onShowHello : function () {
          
    //       MessageToast.show("Hello!");
    //    }
    onNavToChartContainer : function () {
          
          MessageToast.show("Hello!");
       }
    
    });
 });