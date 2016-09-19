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
		MonService.prototype.cleanDatas = function() {
			_.each(this.all, function(performance) {
				performance.note = parseInt(performance.note,10);
				performance.min = parseInt(performance.min,10);
				performance.max = parseInt(performance.max,10);
			});
		};

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
					if (typeof item.id_action === 'undefined') {
						return false;
					}
					if (item.id_action.length === 0) {
						return false;
					}
					return _.find(actionIds, function(idItem) {
						return _.contains(item.id_action, idItem);
					});
				});
			}
		};

		/**
		@name 		getNote
		@desc 		obtenir la note pour une action et une perf données
		@param 		
		@returns 	Note
		*/
		MonService.prototype.getNote = function(actionId, noteVal) {
			var maNote = '???';
			_.each(this.all, function(item) {
				if (item.id_action === actionId) {
					var maVal = parseInt(noteVal,10);
					var min = item.min;
					var max = item.max;
					if (min > max) {
						if ((maVal >= max) && (maVal <= min)) {
							maNote = item.note;
						}
					} else {
						if ((maVal <= max) && (maVal >= min)) {
							maNote = item.note;
						}
					}
				}
			});
			return maNote;
		};

		return new MonService();
	}

})();
