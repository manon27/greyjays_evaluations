(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('PositionService', PositionService);

	/**
	 * Service pour les positions
	 * @param {service} ModelService - Service qui sert de prototype de base
	 * @param {Object} APPLICATION_PARAMS - Paramètres de l'application
	 * @param {string} APPLICATION_ENV - Environnement
	 * @param {service} _ - librairie underscore
	 * @returns {service}
	 */

	/** @ngInject */
	function PositionService(ModelService, APPLICATION_PARAMS, APPLICATION_ENV, _) {

		/**
		 * Constructeur
		 */
		var MonService = function() {
			this.entite=ModelService.setEntite('gj_position');
			this.url = ModelService.setUrl(APPLICATION_PARAMS, APPLICATION_ENV,this.entite);
		};

		/* prototype initial */
		MonService.prototype = Object.create(ModelService);
		MonService.prototype.constructor = MonService;

		/**
		 * Nettoyer les donnees json
		 */
		MonService.prototype.cleanDatas = function() {
			_.each(this.all, function(position) {
				position.id = parseInt(position.id,10);
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
		 * Filtrer sur un libelle
		 * @param {string} libelle - libelle pour filtre
		 * @returns {Object[]}
		 */
		MonService.prototype.filtrerParLibelle = function(lib) {
			return _.find(this.all, function(item) {
				return item.libelle === lib;
			});
		};
		
		/**
		 * Filtrer les positions en fonction d'un tableau d'ids action
		 * @param {Number[]} actionIds - ids d'action
		 * @returns {Object[]}
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
