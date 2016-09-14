(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('ResultatService', ResultatService);

	/**
	@name 		ResultatService
	@desc 		Service pour les resultats
	@param 		ModelService - Service qui sert de prototype de base
	@param 		APPLICATION_PARAMS
	@param  	APPLICATION_ENV
	@param 		_ librairie underscore
	@returns	Service
	*/

	/** @ngInject */
	function ResultatService(ModelService, APPLICATION_PARAMS, APPLICATION_ENV, _) {

		/**
		@name 		MonService
		@desc 		constructeur
		*/
		var MonService = function() {
			this.entite=ModelService.setEntite('resultat');
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
		@desc 		methode pour lier les resultats aux actions te joueurs
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
		@desc 		Filtre les resultats en fonction d'un tableau d'ids action
		@param 		Tableau des ids de actions
		@returns 	Tableau des resultats filtrés
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

		/**
		@name 		filtrerParJoueurs
		@desc 		Filtre les resultats en fonction d'un tableau d'ids action
		@param 		Tableau des ids de actions
		@returns 	Tableau des resultats filtrés
		*/
		MonService.prototype.filtrerParJoueurs = function(joueurIds) {
			if (joueurIds.length > 0) {
				return _.filter(this.all, function(item) {
					if (typeof item.joueur_ids === 'undefined') {
						return false;
					}
					if (item.joueur_ids.length === 0) {
						return false;
					}
					if (item.joueur_ids.length > joueurIds.length) {
						return _.find(joueurIds, function(idItem) {
							return _.contains(item.joueur_ids, idItem);
						});
					} else {
						return _.find(item.joueur_ids, function(idItem) {
							return _.contains(joueurIds, idItem);
						});
					}
				});
			}
		};

		return new MonService();
	}

})();
