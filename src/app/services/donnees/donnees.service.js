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
	function DonneesService(ActionService, JoueurService, PerformanceService, PositionService, ResultatService, _) {

		/* jeu de donnees : dataSets */
		this.dataSets = {};

		/**
		@name 		updateDataSets
		@desc 		fonction pour alimenter le jeu de données
		@param 		filterData : données de filtre
		@return 	void
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
			
			// si le filtre est initialise -> superFiltre !
			if (typeof(filterData) !== 'undefined') {
				this.filtrer(filterData);
			}

			data.joueurListData = _.sortBy(data.joueurListData, 'nom');
			data.positionListData = _.sortBy(data.positionListData, 'libelle');
			data.actionListData = _.sortBy(data.actionListData, 'libelle');
			data.resultatListData = _.sortBy(data.resultatListData, 'performance').reverse();
		};

		/**
		@name	actionListData
		@desc 	ajout la propriété type dans les objets
		@param 	actions
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
		@param 	joueurs
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
		@param 	performances
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
		@param 	positions
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
		@param 	resultats
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
		@name 	filtrer
		@desc 	filtre les datas enfonction du filtre
		@param 	filterData
		@return void
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
		@name		propager
		@desc 		propagation générique
		@param		donneesDepuis
		@param		ModelService
		@param		functionModel
		@return 	
		*/
		this.propager = function(donneesDepuis, ModelService, functionModel) {
			return ModelService[functionModel](_.pluck(donneesDepuis, 'id'));
		};

	}

})();
