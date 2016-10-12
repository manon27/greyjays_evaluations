(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('ModelService', ModelService);

	/**
	 * Service qui va servir de socle pour les autres entités
	 * @param {Object} $rootScope - objet root de l'application
	 * @param {Object} $http - service ajax
	 * @param {module} _ - librairie underscore
	 */

	/** @ngInject */
	function ModelService($rootScope, $http, _) {

		/**
		 * constructeur
		 */
		var MonService = function() {
			this.all = [];
			this.url = '';
			this.entite='model';
		};

		/**
		 * Définir l'entite du service
		 * @param {string} entiteNom
		 * @returns {string}
		 */
		MonService.prototype.setEntite = function(entiteNom) {
			return entiteNom;
		};

		/**
		 * Définir l'url du service
		 * @param {Object} params - Parametres de l'application
		 * @param {string} env - environnement local ou production
		 * @param {sttring} entite - position, joueur....
		 */
		MonService.prototype.setUrl = function(params, env, entite) {
			var monUrl = '';
			if (env === 'json') {
				monUrl = params[env].RESOURCE_URL + '/datas/json/' + entite + 's.json';
			} else {
				monUrl = params[env].RESOURCE_URL + entite;
			}
			return monUrl;
		};

		/**
		 * Récupérer les données de la réponse
		 * @param {Object} response - 
		 * @returns {Object[]}
		 */
		MonService.prototype.parse = function(response) {
			//return response[this.entite+'s'];
			return response;
		};

		/**
		 * Récuperer tous les objets
		 * @returns {Object []}
		 */
		MonService.prototype.getAll = function() {
			var self = this;
			if (self.url === '') {
				throw new Error('You must specify a url on the class');
			}
			return $http({
				url: self.url,
				method: 'GET'
			}).then(
				//callback success
				function(response) {
					//self.all = self.parse($filter('php_crud_api_transform')(response.data));
					self.all = self.parse(response.data);
				}/*,
				// callback erreur
				function() {
					self.all = localStorageService.get(self.entite+'s');
					if (refresh) $rootScope.$broadcast('refresh');
				}*/
			);
		};

		/**
		 * Obtenir un objet
		 * @param {Number} id - identifiant de l'objet à obtenir
		 * @returns {Object}
		 */
		MonService.prototype.get = function(id) {
			return _.find(this.all, function(item) {
				return item.id === id;
			});
		};

		/**
		 * Effacer via requete ajax
		 * @param {Number} id - identifiant de l'objet à effacer
		 * @returns
		 */
		MonService.prototype.delete = function(id) {
			var self = this;
			return $http({
				url: self.url+'/'+id,
				method: 'DELETE'
			}).then(
				// callback success
				function(){
					$rootScope.$broadcast('refresh');
				}/*,
				// callback erreur
				function() {
					var newItems = [];
					_.each(self.all, function(item) {
						if (item.id !== id) {
							newItems.push(item);
						}
					});
					localStorageService.set(self.entite+'s', newItems);
					//
					return self.getAll(true);
				}*/
			);
		};

		/**
		 * Enregistrer via requete ajax
		 * @param {Object} item - objet à ajouter ou modifier
		 * @returns
		 */
		MonService.prototype.save = function (item) {
			var self = this;
			var requeteHttp;
			item.date_modification = new Date();
			if (typeof item.id === 'undefined') {
				//creation => POST
				item.date_creation = new Date();
				requeteHttp = $http({
					url: self.url,
					method: 'POST',
					data: item
				});
			} else {
				//modification => PUT
				requeteHttp = $http({
					url: self.url+'/'+item.id,
					method: 'PUT',
					data: item
				});

			}
			return requeteHttp.then(function(){
				$rootScope.$broadcast('refresh');
			});
		};

		/**
		 * Compter le nombre d'objets
		 * @returns
		*/
		MonService.prototype.count = function() {
			return this.all.length;
		};

		return new MonService();

	}
})();
