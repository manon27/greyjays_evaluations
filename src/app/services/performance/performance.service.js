(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('PerformanceService', PerformanceService);

	/**
	 * Service pour les performances
	 * @param {service} ModelService - Service qui sert de prototype de base
	 * @param {Object} APPLICATION_PARAMS - Paramètres de l'application
	 * @param {string} APPLICATION_ENV - Environnement
	 * @param {module} _ - librairie underscore
	 * @returns {service}
	 */

	/** @ngInject */
	function PerformanceService(ModelService, APPLICATION_PARAMS, APPLICATION_ENV, _) {

		/**
		 * Constructeur
		 */
		var MonService = function() {
			this.entite=ModelService.setEntite('gj_performance');
			this.url = ModelService.setUrl(APPLICATION_PARAMS, APPLICATION_ENV,this.entite);
		};

		/* prototype initial */
		MonService.prototype = Object.create(ModelService);
		MonService.prototype.constructor = MonService;

		/**
		 * Nettoyer les donnees json
		 * - convertir les chaines en entiers
		 */
		MonService.prototype.cleanDatas = function() {
			_.each(this.all, function(performance) {
				performance.id = parseInt(performance.id,10);
				performance.id_action = parseInt(performance.id_action,10);
				performance.note = parseInt(performance.note,10);
				performance.min = parseInt(performance.min,10);
				performance.max = parseInt(performance.max,10);
			});
		};

		/**
		 * Lier les performances aux actions
		 * @param {Number[]} actionsById - ids d'action
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
		 * Filtrer sur un identifiant
		 * @param {Number} id - identifiant du filtre
		 * @returns {Object}
		 */
		MonService.prototype.filtrerParId = function(id) {
			return _.find(this.all, function(item) {
				return item.id === id;
			});
		};

		/**
		 * Filtre les performances en fonction d'un tableau d'ids action
		 * @param {Number[]} actionIds - ids de actions
		 * @returns {Object[]}
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
						return item.id_action === idItem;
					});
				});
			}
		};

		/**
		 * Obtenir le libellé pour une action et une note
		 * @param {Number} actionId - id de l'action
		 * @param {Number} noteVal - note
		 * @returns {string}
		 */
		MonService.prototype.getLibelle = function(actionId, noteVal) {
			var monLibelle = '???';
			_.each(this.all, function(item) {
				if ((item.id_action === actionId) && (item.note === noteVal)) {
					monLibelle = item.libelle;
				}
			});
			return monLibelle;
		};

		return new MonService();
	}

})();
