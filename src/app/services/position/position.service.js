(function() {
	'use strict';

	angular
		.module('greyjaysEvaluation')
		.service('PositionService', PositionService);

	/** @ngInject */
	function PositionService(ModelService, APPLICATION_PARAMS, APPLICATION_ENV, _) {

		var MonService = function() {
			this.url = ModelService.setUrl(APPLICATION_PARAMS, APPLICATION_ENV, 'positions');
		};

		MonService.prototype = Object.create(ModelService);
		MonService.prototype.constructor = MonService;

		MonService.prototype.parse = function(response) {
			return response.versionoss;
		};

		MonService.prototype.cleanDatas = function() {
			
		};

		MonService.prototype.filtrerParId = function(id) {
			return _.find(this.all, function(item) {
				return item.id === id;
			});
		};

		MonService.prototype.filtrerParActions = function(actionIds) {
			if (actionIds.length > 0) {
				return _.filter(this.all, function(item) {
					if (typeof item.action_ids === 'undefined') {
						return false;
					}
					if (item.action_ids.length === 0) {
						return false;
					}
					if (item.action_ids.length > actionIds.length) {
						return _.find(actionIds, function(idItem) {
							return _.contains(item.action_ids, idItem);
						});
					} else {
						return _.find(item.action_ids, function(idItem) {
							return _.contains(actionIds, idItem);
						});
					}
				});
			}
		};

		return new MonService();
	}

})();
