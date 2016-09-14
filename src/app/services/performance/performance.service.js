(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('PerformanceService', PerformanceService);

	/**
	@name 		PerformanceService
	@desc 		Service pour les performances
	@param 		ModelService - Service qui sert de prototype de base
	@param 		APPLICATION_PARAMS
	@param  	APPLICATION_ENV
	@param 		_ librairie underscore
	@returns	Service
	*/

	/** @ngInject */
	function PerformanceService(ModelService, APPLICATION_PARAMS, APPLICATION_ENV, _) {

		/**
		@name 		MonService
		@desc 		constructeur
		*/
		var MonService = function() {
			this.entite=ModelService.setEntite('performance');
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
		@desc 		methode pour lier les performances aux actions
		*/
		MonService.prototype.linkModels = function(actionsById) {

			_.each(this.all, function(performance) {

				//	1 action
				if (typeof performance.id_action != 'undefined') {
					var action = actionsById[performance.id_action];
					if (typeof action != 'undefined') {
						if (action) {
							//Add action to performance
							performance.action = action;
							//Add performance to societe
							if (typeof action.performance_ids === 'undefined') {
								action.performance_ids = [];
								action.performances = [];
							}
							action.performance_ids.push(performance.id);
							action.performances.push(performance);
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
		@name 		filtrerParActions
		@desc 		Filtre les performances en fonction d'un tableau d'ids action
		@param 		Tableau des ids de actions
		@returns 	Tableau des performances filtrées
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
