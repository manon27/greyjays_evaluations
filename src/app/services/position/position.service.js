(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('PositionService', PositionService);

	/**
	@name 		PositionService
	@desc 		Service pour les positions
	@param 		ModelService - Service qui sert de prototype de base
	@param 		APPLICATION_PARAMS
	@param  	APPLICATION_ENV
	@param 		_ librairie underscore
	@returns	Service
	*/

	/** @ngInject */
	function PositionService(ModelService, APPLICATION_PARAMS, APPLICATION_ENV, _) {

		/**
		@name 		MonService
		@desc 		constructeur
		*/
		var MonService = function() {
			this.entite=ModelService.setEntite('position');
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
		MonService.prototype.cleanDatas = function() {
			_.each(this.all, function(position) {
				position.id = parseInt(position.id,10);
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
		@name 		filtrerParLibelle
		@desc 		methode pour filtrer sur un libelle
		@param 		libelle : libelle pour filtre
		@returns 	object correspondant
		*/
		MonService.prototype.filtrerParLibelle = function(lib) {
			return _.find(this.all, function(item) {
				return item.libelle === lib;
			});
		};
		
		/**
		@name 		filtrerParActions
		@desc 		Filtre les positions en fonction d'un tableau d'ids action
		@param 		Tableau des ids d'action
		@returns 	Tableau des positions filtrées
		*/
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
