(function() {
	'use strict';

	angular
		.module('greyjaysEvaluation')
		.service('ModelService', ModelService);

	/** @ngInject */
	function ModelService($rootScope, $http, _) {

		var MonService = function() {
			this.all = [];
			this.url = '';
		};

		MonService.prototype.setUrl = function(params, env, strObj) {
			var monUrl = '';
			if (env === 'local') {
				monUrl = params[env].RESOURCE_URL + '/datas/' + strObj + '.json';
			} else {
				monUrl = params[env].RESOURCE_URL + '&' + params[env].PORTLET_PARAM + 'type=list&' + params[env].PORTLET_PARAM + 'entity=' + strObj;
			}
			return monUrl;
		};

		MonService.prototype.parse = function(response) {
			return response.models;
		};

		MonService.prototype.fetch = function() {
			var self = this;
			if (self.url === '') {
				throw new Error('You must specify a url on the class');
			}
			return $http.get(self.url).success(function(response) { self.all = self.parse(response); });
		};

		MonService.prototype.get = function(id) {
			return _.find(this.all, function(item) {
				return item.id === id;
			});
		};

		MonService.prototype.count = function() {
			return this.all.length;
		};

		return new MonService();

	}
})();
