sap.ui.define([
	"sap/ui/core/UIComponent",
	'sap/ui/model/json/JSONModel',
	'sap/f/library'
], function (UIComponent, JSONModel, fioriLibrary) {
	"use strict";
	return UIComponent.extend("sap.ui.demo.products.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			// call the init function of the parent
			var oModel,
				oProductsModel,
				oRouter;
			UIComponent.prototype.init.apply(this, arguments);

			oModel = new JSONModel();
			this.setModel(oModel);

			oRouter = this.getRouter();
			oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
			oRouter.initialize();
		},
		_onBeforeRouteMatched: function (oEvent) {
			var oModel = this.getModel(),
				sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, set a default layout (normally OneColumn)
			if (!sLayout) {
				sLayout = fioriLibrary.LayoutType.OneColumn;
			}

			oModel.setProperty("/layout", sLayout);
		},
		createContent: function () {
			// create root view
			return sap.ui.view("AppView", {
				viewName: "sap.ui.demo.products.view.App",
				type: "XML"
			});
		}
	});
});