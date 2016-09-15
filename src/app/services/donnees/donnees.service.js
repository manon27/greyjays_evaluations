(function() {

	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('DonneesService', DonneesService);

	/**
	@name 		DonneesService
	@desc 		Service qui contient l'intégralité des données présentes dans l'interface
	@param 		Services + librairie underscore
	@returns 	
	*/

	/** @ngInject */
	function DonneesService(ActionService, JoueurService, PerformanceService, PositionService, ResultatService, localStorageService, _) {

		/* jeu de donnees : dataSets */
		this.dataSets = {};

		/**
		@name 	updateDataSets
		@desc 	fonction pour alimenter le jeu de données
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
			
			/*
			if (lesPositions.length===0) { // pas de données ou pas de connexion
				if (localStorageService.get('positions') !== null) { // presence dans le localstorage
					lesPositions=localStorageService.get('positions');
				}
			}
			data.positionListData = lesPositions;
			if (localStorageService.isSupported) {
				localStorageService.set('positions', lesPositions);
			}
			*/
			// si le filtre est initialise -> superFiltre !
			if (typeof(filterData) !== 'undefined') {
				this.actualiser(filterData);
			}

		};

		/**
		@name	actionListData
		@desc 	ajout la propriété type dans les objets
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
		@name	joueurListData
		@desc 	ajout la propriété type dans les objets
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
		@name	performanceListData
		@desc 	ajout la propriété type dans les objets
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
		@name	positionListData
		@desc 	ajout la propriété type dans les objets
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
		@name	resultatListData
		@desc 	ajout la propriété type dans les objets
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

		this.actualiser = function(filterData) {

			this.filtrer(filterData);
			//-----------------------------------------------------------
			//	trier
			//-----------------------------------------------------------
			this.dataSets.joueurListData = _.sortBy(this.dataSets.joueurListData, 'nom');
			this.dataSets.positionListData = _.sortBy(this.dataSets.positionListData, 'libelle');
			this.dataSets.actionListData = _.sortBy(this.dataSets.actionListData, 'libelle');
			
		};

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
			aResultats = component.dataSets.resultatListData;
			aResultats = _.intersection(aResultats, component.propager(aActions, ResultatService, "filtrerParActions"));
			aResultats = _.intersection(aResultats, component.propager(aJoueurs, ResultatService, "filtrerParJoueurs"));

			this.dataSets.joueurListData = aJoueurs;
			this.dataSets.positionListData = aPositions;
			this.dataSets.actionListData = aActions;
			this.dataSets.performanceListData = aPerformances;
			this.dataSets.resultatListData = aResultats;

		};

		this.propager = function(donneesDepuis, ModelService, functionModel) {
			return ModelService[functionModel](_.pluck(donneesDepuis, 'id'));
		};

	}

})();
