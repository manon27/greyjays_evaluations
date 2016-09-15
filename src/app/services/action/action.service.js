(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('ActionService', ActionService);

	/**
	@name 		ActionService
	@desc 		Service pour les actions
	@param 		ModelService - Service qui sert de prototype de base
	@param 		APPLICATION_PARAMS
	@param  	APPLICATION_ENV
	@param 		_ librairie underscore
	@returns	Service
	*/

	/** @ngInject */
	function ActionService(ModelService, APPLICATION_PARAMS, APPLICATION_ENV, _) {

		/**
		@name 		MonService
		@desc 		constructeur
		*/
		var MonService = function() {
			this.entite=ModelService.setEntite('action');
			this.url = ModelService.setUrl(APPLICATION_PARAMS, APPLICATION_ENV,this.entite);
		};

		/**
		prototype initial
		*/
		MonService.prototype = Object.create(ModelService);
		MonService.prototype.constructor = MonService;

		/**
		@name 		cleanDatas
		@desc 		methode pour nettoyer les donnees json
		*/
		MonService.prototype.cleanDatas = function() {};

		/**
		@name 		linkModels
		@desc 		methode pour lier les actions aux positions
		*/
		MonService.prototype.linkModels = function(positionsById) {

			_.each(this.all, function(action) {

				//	1 position
				if (typeof action.id_position != 'undefined') {
					var position = positionsById[action.id_position];
					if (typeof position != 'undefined') {
						if (position) {
							//Add position to action
							action.position = position;
							//Add action to societe
							if (typeof position.action_ids === 'undefined') {
								position.action_ids = [];
								position.actions = [];
							}
							position.action_ids.push(action.id);
							position.actions.push(action);
						}
					}
				}

			});
		};

		/**
		@name 		filtrerParId
		@desc 		methode pour filtrer sur un identifiant
		@param 		id : identifiant du filtre
		@returns 	object correspondant
		*/
		MonService.prototype.filtrerParId = function(id) {
			return _.find(this.all, function(item) {
				return item.id === id;
			});
		};

		/**
		@name 		filtrerParPositions
		@desc 		Filtre les actions en fonction d'un tableau d'ids position
		@param 		Tableau des ids de positions
		@returns 	Tableau des actions filtrées
		*/
		MonService.prototype.filtrerParPositions = function(positionIds) {
			if (positionIds.length > 0) {
				return _.filter(this.all, function(item) {
					if (typeof item.id_position === 'undefined') {
						return false;
					}
					if (item.id_position.length === 0) {
						return false;
					}
					return _.find(positionIds, function(idItem) {
						return _.contains(item.id_position, idItem);
					});
				});
			}
		};

		return new MonService();
	}

})();
