(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('ModelService', ModelService);

	/**
	*	@name		ModelService
	*	@desc		Service qui va servir de socle pour les autres entités
	*	@param  	http : service ajax
	*	@param 		filter : service de filtre (pour faire appel au transformateur api_crud)
	*	@param 		httpParamSerializer : service qui transforme un objet json en params de formulaire
	*	@param 		_ : librairie underscore
	*/

	/** @ngInject */
	function ModelService($http, $filter, $httpParamSerializer, _) {

		/**
		@name	MonService
		@desc	constructeur
		*/
		var MonService = function() {
			this.all = [];
			this.url = '';
			this.entite='model';
		};

		/**
		@name	setEntite
		@desc 	setter classique
		@param 	entiteNom
		*/
		MonService.prototype.setEntite = function(entiteNom) {
			return entiteNom;
		};

		/**
		@name 	setUrl
		@desc 	setter classique
		@param 	params : objet global de parametrage
		@param 	env : environnement local ou production
		@param 	entite : position, joueur....
		*/
		MonService.prototype.setUrl = function(params, env, entite) {
			var monUrl = '';
			if (env === 'local') {
				monUrl = params[env].RESOURCE_URL + '/datas/json/' + entite + '.json';
			} else {
				monUrl = params[env].RESOURCE_URL + entite;
			}
			return monUrl;
		};

		/**
		@name		parse
		@desc 		
		@param 		response : json après application de la transformation
		@returns	objet "entites" qui est un tableau d'objet de type entite
		*/
		MonService.prototype.parse = function(response) {
			return response[this.entite+'s'];
		};

		/**
		@name 		getAll
		@desc 		récuperer tous les objets
		@returns	promise http
		*/
		MonService.prototype.getAll = function() {
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

		/**
		@name 		get
		@desc 		
		@param 		id de l'objet à obtenir
		@returns	objet correspondant
		*/
		MonService.prototype.get = function(id) {
			return _.find(this.all, function(item) {
				return item.id === id;
			});
		};

		/**
		@name		delete
		@desc 		efface via requete ajax
		@param 		id de l'objet à effacer
		@returns 	promise http
		*/
		MonService.prototype.delete = function(id) {
			var self = this;
			return $http({
				url: self.url+'/'+id,
				method: 'DELETE'
			}).success(function(){
				self.fetch();
			});
		};

		/**
		@name		save
		@desc 		enregistre via requete ajax
		@param 		item : objet à ajouter ou modifier
		@returns 	promise http
		*/
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

		/**
		@name 		count
		@desc 		compte le nombre d'objets
		@returns 	le nombre total d'objets
		*/
		MonService.prototype.count = function() {
			return this.all.length;
		};

		return new MonService();

	}
})();
