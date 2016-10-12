(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('JoueurService', JoueurService);

	/**
	 * Service pour les joueurs
	 * @param {service} ModelService - Service qui sert de prototype de base
	 * @param {Object} APPLICATION_PARAMS - Paramètres de l'application
	 * @param {string} APPLICATION_ENV - Environnement
	 * @param {module} _ - librairie underscore
	 * @returns {service}
	 */

	/** @ngInject */
	function JoueurService(ModelService, APPLICATION_PARAMS, APPLICATION_ENV, _) {

		/**
		 * Constructeur
		 */
		var MonService = function() {
			this.entite=ModelService.setEntite('gj_joueur');
			this.url = ModelService.setUrl(APPLICATION_PARAMS, APPLICATION_ENV,this.entite);
		};

		/* prototype initial */
		MonService.prototype = Object.create(ModelService);
		MonService.prototype.constructor = MonService;

		/**
		 * Nettoyer les données de l'objet json
		 *  - Conversion des chaines en entiers		
		 */
		MonService.prototype.cleanDatas = function() {
			_.each(this.all, function(joueur) {
				joueur.id = parseInt(joueur.id,10);
				joueur.poids = parseInt(joueur.poids,10);
				joueur.taille = parseInt(joueur.taille,10);
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
		 * Filtre les positions en fonction d'un tableau d'ids action
		 * @param {Number[]} actionIds - Tableau des ids d'action
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
