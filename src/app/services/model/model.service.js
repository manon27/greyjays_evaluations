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

		MonService.prototype.delete = function(id) {
			for (var i in this.all) {
				if (this.all[i].id == id) {
					this.all.splice(i, 1);
				}
			}
		};

		MonService.prototype.save = function (item) {
			var self = this;
			if (item.id === null) {
				//if this is new contact, add it in contacts array
				var uid = self.count();
				item.id = uid++;
				self.all.push(item);
			} else {
				//for existing contact, find this contact using id
				//and update it.
				for (var i in self.all) {
					if (self.all[i].id == item.id) {
						self.all[i] = item;
					}
				}
			}
		};

		MonService.prototype.count = function() {
			return this.all.length;
		};

		return new MonService();

	}
})();
