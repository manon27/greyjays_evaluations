(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('ModelService', ModelService);

	/** @ngInject */
	function ModelService($http, $filter, $httpParamSerializer, _) {

		/**
		*	@name	Service Model
		*	@desc	Service qui va servir de socle pour les autres entités
		*	@param {} http
		*	@param {} _ 
		*	@returns	ModelService
		*/

		var MonService = function() {
			this.all = [];
			this.url = '';
			this.entite='model';
		};

		MonService.prototype.setEntite = function(entiteNom) {
			return entiteNom;
		};

		MonService.prototype.setUrl = function(params, env, entite) {
			var monUrl = '';
			if (env === 'local') {
				monUrl = params[env].RESOURCE_URL + '/datas/json/' + entite + '.json';
			} else {
				monUrl = params[env].RESOURCE_URL + entite;
			}
			return monUrl;
		};

		MonService.prototype.parse = function(response) {
			return response[this.entite+'s'];
		};

		MonService.prototype.fetch = function() {
			var self = this;
			if (self.url === '') {
				throw new Error('You must specify a url on the class');
			}
			return $http({
				url: self.url,
				method: 'GET'
			}).success(function(response) {
				self.all = self.parse($filter('php_crud_api_transform')(response));
			});
		};

		MonService.prototype.get = function(id) {
			return _.find(this.all, function(item) {
				return item.id === id;
			});
		};

		MonService.prototype.delete = function(id) {
			var self = this;
			return $http({
				url: self.url+'/'+id,
				method: 'DELETE'
			}).success(function(){
				self.fetch();
			});
		};

		MonService.prototype.save = function (item) {
			var self = this;
			var requeteHttp;
			if (typeof item.id === 'undefined') {
				// creation => POST
				requeteHttp = $http({
					url: self.url,
					method: 'POST',
					data: item
				});
			} else {
				//	modification => PUT /api.php/models/id?champs=valeur
				requeteHttp = $http({
					url: self.url+'/'+item.id,
					method: 'PUT',
					data: $httpParamSerializer(item)
				});
			}
			return requeteHttp.success(function(){
				self.fetch();
			});
		};

		MonService.prototype.count = function() {
			return this.all.length;
		};

		return new MonService();

	}
})();
