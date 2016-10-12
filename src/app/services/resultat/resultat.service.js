(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('ResultatService', ResultatService);

	/**
	 * Service pour les resultats
	 * @param {service} ModelService - Service qui sert de prototype de base
	 * @param {Object} APPLICATION_PARAMS - Paramètres de l'application
	 * @param {string} APPLICATION_ENV - Environnement
	 * @param {service} _ - librairie underscore
	 * @returns	{service}
	 */

	/** @ngInject */
	function ResultatService(ModelService, APPLICATION_PARAMS, APPLICATION_ENV, _) {

		/**
		 * Constructeur
		 */
		var MonService = function() {
			this.entite=ModelService.setEntite('gj_resultat');
			this.url = ModelService.setUrl(APPLICATION_PARAMS, APPLICATION_ENV,this.entite);
		};

		/* prototype initial */
		MonService.prototype = Object.create(ModelService);
		MonService.prototype.constructor = MonService;

		/**
		 * nettoyer les donnees json
		 */
		MonService.prototype.cleanDatas = function() {
			_.each(this.all, function(resultat) {
				resultat.id 		= parseInt(resultat.id,10);
				resultat.id_action 	= parseInt(resultat.id_action,10);
				resultat.id_joueur 	= parseInt(resultat.id_joueur,10);
				resultat.performance= parseInt(resultat.performance,10);
				resultat.inmatch	= parseInt(resultat.inmatch,10);
			});
		};

		/**
		 * Lier les resultats aux actions et joueurs
		 * @param {Number[]} actionsById - ids des actions
		 * @param {Number[]} joueursById - ids des joueurs
		 */
		MonService.prototype.linkModels = function(actionsById, joueursById) {

			_.each(this.all, function(resultat) {

				//	1 action
				if (typeof resultat.id_action != 'undefined') {
					var action = actionsById[resultat.id_action];
					if (typeof action != 'undefined') {
						if (action) {
							//Add action to resultat
							resultat.action = action;
							//Add resultat to action
							if (typeof action.resultat_ids === 'undefined') {
								action.resultat_ids = [];
								action.resultats = [];
							}
							action.resultat_ids.push(resultat.id);
							action.resultats.push(resultat);
						}
					}
				}

				//	1 joueur
				if (typeof resultat.id_joueur != 'undefined') {
					var joueur = joueursById[resultat.id_joueur];
					if (typeof joueur != 'undefined') {
						if (joueur) {
							//Add joueur to resultat
							resultat.joueur = joueur;
							//Add resultat to joueur
							if (typeof joueur.resultat_ids === 'undefined') {
								joueur.resultat_ids = [];
								joueur.resultats = [];
							}
							joueur.resultat_ids.push(resultat.id);
							joueur.resultats.push(resultat);
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
		 * Filtrer les resultats en fonction d'un tableau d'ids action
		 * @param {Number[]} actionIds - ids d'action
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
		 * Filtrer les resultats en fonction d'un tableau d'ids joueur
		 * @param {Number[]} joueurId - ids de joueur
		 * @returns {Object[]}
		 */
		MonService.prototype.filtrerParJoueurs = function(joueurIds) {
			if (joueurIds.length > 0) {
				return _.filter(this.all, function(item) {
					if (typeof item.id_joueur === 'undefined') {
						return false;
					}
					if (item.id_joueur.length === 0) {
						return false;
					}
					return _.find(joueurIds, function(idItem) {
						return item.id_joueur === idItem;
					});
				});
			}
		};

		/**
		 * Plus petit resultat sur une action
		 * @param {Number} actionId  - id de l'action
		 * @returns {Object}
		 */
		MonService.prototype.getPerformanceMin = function(actionId) {
			var results = _.filter(this.all, function(item) {
				return item.id_action === actionId;
			});
			return _.min(results, function(item) {
				return item.performance;
			});
		};

		/**
		 * Plus grand resultat sur une action
		 * @param {Number} actionId  - id de l'action
		 * @returns {Object}
		 */
		MonService.prototype.getPerformanceMax = function(actionId) {
			var results = _.filter(this.all, function(item) {
				return item.id_action === actionId;
			});
			return _.max(results, function(item) {
				return item.performance;
			});
		};

		return new MonService();
	}

})();
