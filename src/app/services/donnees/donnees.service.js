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
		this.updateDataSets = function() {

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
	}

})();
