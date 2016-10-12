(function() {

	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('DonneesService', DonneesService);

	/**
	 * Service qui contient l'intégralité des données présentes dans l'interface
	 * @param {service} Services + librairie underscore
	 * @returns {service}
	 */

	/** @ngInject */
	function DonneesService(ActionService, JoueurService, PerformanceService, PositionService, ResultatService, _) {

		/* jeu de donnees : dataSets */
		this.dataSets = {};

		/**
		 * Alimenter le jeu de données
		 * @param {object} - filterData - données de filtre
		 */
		this.updateDataSets = function(filterData) {

			var data = this.dataSets;

			// initialisation des ListData avec l ensemble des valeurs json
			var lesActions=this.actionListData(ActionService.all);
			var lesJoueurs=this.joueurListData(JoueurService.all);
			var lesPerformances=this.positionListData(PerformanceService.all);
			var lesPositions=this.positionListData(PositionService.all);
			var lesResultats=this.resultatListData(ResultatService.all);
			data.actionListData = lesActions;
			data.joueurListData = lesJoueurs;
			data.performanceListData = lesPerformances;
			data.positionListData = lesPositions;
			data.resultatListData = lesResultats;

			// compléter le jeu de données avec des données calculées
			this.enrichir();
			
			// si le filtre est initialise -> filtre !
			if (typeof(filterData) !== 'undefined') {
				this.filtrer(filterData);
			}

			data.joueurListData = _.sortBy(data.joueurListData, 'nom');
			data.positionListData = _.sortBy(data.positionListData, 'id');
			data.actionListData = _.sortBy(data.actionListData, 'libelle');
			data.performanceListData = _.sortBy(data.performanceListData, 'id_action');
			data.resultatListData = _.sortBy(data.resultatListData, 'performance').reverse();
		};

		/**
		 * Ajouter la propriété type dans les actions
		 * @param {Object[]} actions - les actions
		 * @returns {Object[]}
		 */
		this.actionListData = function(actions) {
			if (typeof actions === 'undefined') {
				return [];
			}
			_.each(actions, function(action) {
				action.type = 'action';
			});
			return actions;
		};

		/**
		 * Ajouter la propriété type dans les joueurs
		 * @param {Object[]} joueurs - les joueurs
		 * @returns {Object[]}
		 */
		this.joueurListData = function(joueurs) {
			if (typeof joueurs === 'undefined') {
				return [];
			}
			_.each(joueurs, function(joueur) {
				joueur.type = 'joueur';
			});
			return joueurs;
		};
		
		/**
		 * Ajouter la propriété type dans les performances
		 * @param {Object[]} performances - les performances
		 * @returns {Object[]}
		 */
		this.performanceListData = function(performances) {
			if (typeof performances === 'undefined') {
				return [];
			}
			_.each(performances, function(performance) {
				performance.type = 'performance';
			});
			return performances;
		};

		/**
		 * Ajouter la propriété type dans les positions
		 * @param {Object[]} positions - les positions
		 * @returns {Object[]}
		 */
		this.positionListData = function(positions) {
			if (typeof positions === 'undefined') {
				return [];
			}
			_.each(positions, function(position) {
				position.type = 'position';
			});
			return positions;
		};

		/**
		 * Ajout la propriété type dans les resultats
		 * @param {Object[]} resultats - les résultats
		 * @returns {Object[]}
		 */
		this.resultatListData = function(resultats) {
			if (typeof resultats === 'undefined') {
				return [];
			}
			_.each(resultats, function(resultat) {
				resultat.type = 'resultat';
			});
			return resultats;
		};

		/**
		 * Enrichir les données avec des informations calculées
		 */
		this.enrichir = function() {
			_.each(this.dataSets.resultatListData, function(item) {
				var aNote = [];
				var laNote, min, max, lePas, i, j, k;
				if (item.action.mesurable === 0) {
					item.libPerformance = PerformanceService.getLibelle(item.id_action, item.performance);
					for (i=0; i<item.performance; i++) {
						aNote.push(i);
					}
					item.maNote = aNote;
				} else if (item.action.mesurable === 1) {
					item.libPerformance = item.performance;
					laNote=0;
					min = ResultatService.getPerformanceMin(item.id_action).performance;
					max = ResultatService.getPerformanceMax(item.id_action).performance;
					if (item.performance === min) { laNote = 1;}
					if (item.performance === max) { laNote = 5;}
					if (laNote===0) {
						lePas = (max - min) / 3;
						for (j=0; j<3; j++) {
							if (item.performance >= min + lePas * j) {
								laNote = j+2;
							}
						}
					}
					for (k=0; k<laNote; k++) {
						aNote.push(k);
					}
					item.maNote = aNote;
				} else if (item.action.mesurable === 2) {
					item.libPerformance = item.performance;
					laNote=0;
					min = ResultatService.getPerformanceMin(item.id_action).performance;
					max = ResultatService.getPerformanceMax(item.id_action).performance;
					if (item.performance === min) { laNote = 5;}
					if (item.performance === max) { laNote = 1;}
					if (laNote===0) {
						lePas = (max - min) / 3;
						for (j=0; j<3; j++) {
							if (item.performance <= max - lePas * j) {
								laNote = j+2;
							}
						}
					}
					for (k=0; k<laNote; k++) {
						aNote.push(k);
					}
					item.maNote = aNote;
				}
			});

		};

		/**
		 * filtrer les datas en fonction du filtre
		 * @param {Object} filterData - données du filtre
		 */
		this.filtrer = function(filterData) {
			var component = this;
			var aJoueurs = [];
			var aPositions = [];
			var aActions = [];
			var aPerformances = [];
			var aResultats = [];

			if (filterData.actionIds.length > 0) {
				aActions.push(ActionService.filtrerParId(filterData.actionIds[0]));
			} else {
				aActions = component.dataSets.actionListData;
			}

			if (filterData.positionIds.length > 0) {
				aPositions.push(PositionService.filtrerParId(filterData.positionIds[0]));
			} else {
				aPositions = component.dataSets.positionListData;
			}

			if (filterData.joueurIds.length > 0) {
				aJoueurs.push(JoueurService.filtrerParId(filterData.joueurIds[0]));
			} else {
				aJoueurs = component.dataSets.joueurListData;
			}

			aResultats = component.dataSets.resultatListData;

			//	si selection du joueur ==> filtre des resultats
			if ((aJoueurs.length === 1) && (aResultats.length > 1)) {
				aResultats = component.propager(
					aJoueurs,
					ResultatService,
					"filtrerParJoueurs"
				);
			}

			//	si selection de position ==> filtre des actions
			if ((aPositions.length === 1) && (aActions.length > 1)) {
				aActions = component.propager(
					aPositions,
					ActionService,
					"filtrerParPositions"
				);
			}

			//	si selection de action ==> filtre des positions
			if ((aActions.length === 1) && (aPositions.length > 1)) {
				aPositions = component.propager(
					aActions,
					PositionService,
					"filtrerParActions"
				);
			}

			aPerformances = component.propager(aActions, PerformanceService, "filtrerParActions");
			aResultats = _.intersection(aResultats, component.propager(aActions, ResultatService, "filtrerParActions"));
			
			this.dataSets.joueurListData = aJoueurs;
			this.dataSets.positionListData = aPositions;
			this.dataSets.actionListData = aActions;
			this.dataSets.performanceListData = aPerformances;
			this.dataSets.resultatListData = aResultats;

		};

		/**
		 * propagation générique
		 * @param {Object[]} donneesDepuis - Donnees qui vont servir à filtrer
		 * @param {service} ModelService - Service des données à filtrer
		 * @param {string} functionModel - Methode du service à appeler
		 * @returns {Object[]}
		*/
		this.propager = function(donneesDepuis, ModelService, functionModel) {
			return ModelService[functionModel](_.pluck(donneesDepuis, 'id'));
		};

	}

})();
