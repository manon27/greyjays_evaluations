(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('ActionService', ActionService);

	/**
	 * Service pour les actions
	 * @param {service} ModelService - Service qui sert de prototype de base
	 * @param {Object} APPLICATION_PARAMS - objet des parametres de l'application
	 * @param {string} APPLICATION_ENV - Environnement
	 * @param {module} _ - librairie underscore
	 * @returns {service}
	 */

	/** @ngInject */
	function ActionService(ModelService, APPLICATION_PARAMS, APPLICATION_ENV, _) {

		/**
		 * constructeur
		 */
		var MonService = function() {
			this.entite=ModelService.setEntite('gj_action');
			this.url = ModelService.setUrl(APPLICATION_PARAMS, APPLICATION_ENV,this.entite);
		};

		/* prototype initial */
		MonService.prototype = Object.create(ModelService);
		MonService.prototype.constructor = MonService;

		/**
		 * nettoyer les donnees json (convertir des chaines en entier)
		 */
		MonService.prototype.cleanDatas = function() {
			_.each(this.all, function(action) {
				action.id = parseInt(action.id,10);
				action.id_position = parseInt(action.id_position,10);
				action.mesurable = parseInt(action.mesurable,10);
			});
		};

		/**
		 * lier les actions aux positions
		 * @param {Number[]} positionsById - tableau des ids de position
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
		 * filtrer sur un identifiant
		 * @param {Number} id - identifiant du filtre
		 * @returns {Object}
		 */
		MonService.prototype.filtrerParId = function(id) {
			return _.find(this.all, function(item) {
				return item.id === id;
			});
		};

		/**
		 * Filtrer les actions en fonction d'un tableau d'ids position
		 * @param {Number[]} positionIds - Tableau des ids de positions
		 * @returns {Object[]}
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
						return item.id_position === idItem;
					});
				});
			}
		};

		/**
		 * Filtrer les actions en fonction d'un tableau d'ids performance
		 * @param {Number[]} performanceIds - Tableau des ids de performances
		 * @returns {Object[]}
		 */
		MonService.prototype.filtrerParPerformances = function(performanceIds) {
			if (performanceIds.length > 0) {
				return _.filter(this.all, function(item) {
					if (typeof item.performance_ids === 'undefined') {
						return false;
					}
					if (item.performance_ids.length === 0) {
						return false;
					}
					if (item.performance_ids.length > performanceIds.length) {
						return _.find(performanceIds, function(idItem) {
							return _.contains(item.performance_ids, idItem);
						});
					} else {
						return _.find(item.performance_ids, function(idItem) {
							return _.contains(performanceIds, idItem);
						});
					}
				});
			}
		};

		return new MonService();
	}

})();
