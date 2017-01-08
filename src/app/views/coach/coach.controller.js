(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('CoachController', CoachController);

	/**
	 * Controlleur pour la page du coach
	 * @param {Object} $scope
	 * @param {Object} $q
	 * @param {module} _ - librairie underscore
	 * @param ...
	 */

	/** @ngInject */
	function CoachController($scope, $q, _, ActionService, JoueurService, PerformanceService, PositionService, ResultatService, DonneesService) {

		var coach = $scope;

		coach.loading = true;

		//initialisation des filtres pour chaque entite
		coach.filterData = {
			actionIds: [],
			joueurIds: [],
			performanceIds: [],
			positionIds: [],
			resultatIds: []
		};

		DonneesService.updateDataSets(coach.filterData);

		init();

		// declaration des services dans le scope pour pouvoir les utiliser dans la vue
		coach.actionService = ActionService;
		coach.joueurService = JoueurService;
		coach.performanceService = PerformanceService;
		coach.positionService = PositionService;
		coach.resultatService = ResultatService;
		coach.donneesService = DonneesService;
		coach.donneesServiceForStat = null;
		
		/**
		 *	Filtrer après sélection
		 */
		coach.$on('filtrerDatas', function() {
			var deferred = $q.defer();

			function applyRefresh() {
				_.delay(function() {
					$scope.$apply(function() {
						// mise à jour du jeu de donnees
						init();
						deferred.resolve('Finished refresh');
					});
				}, 250);

				return deferred.promise;
			}

			//	Calculs en cours
			coach.loading = true;

			applyRefresh().then(function() {
				//	Calculs en cours termine
				coach.loading = false;
			});
		});

		/**
		 *	Rafraichir apres appel ajax
		 */
		coach.$on('refresh', function() {
			var deferred = $q.defer();

			function applyRefresh() {
				_.delay(function() {
					$scope.$apply(function() {
						// mise à jour du jeu de donnees
						init();
						deferred.resolve('Finished refresh');
					});
				}, 250);

				return deferred.promise;
			}

			//	Calculs en cours
			coach.loading = true;

			applyRefresh().then(function() {
				//	Calculs en cours termine
				coach.loading = false;
			});
		});

		/**
		 * Actualiser les données via les services
		 */
		function init() {
			var modelCount = 0;
			var models = [
				ActionService, JoueurService, PerformanceService, PositionService, ResultatService
			];

			_.each(models, function(Model) {
				Model.getAll().then(function() {
					modelCount++;
					if (modelCount === models.length) {

						//---------------cleanDatas-----------------------
						ActionService.cleanDatas();
						JoueurService.cleanDatas();
						PerformanceService.cleanDatas();
						PositionService.cleanDatas();
						ResultatService.cleanDatas();

						//---------------indexById-----------------------
						var actionsById = _.indexBy(ActionService.all, 'id');
						var joueursById = _.indexBy(JoueurService.all, 'id');
						//var performancesById = _.indexBy(PerformanceService.all, 'id');
						var positionsById = _.indexBy(PositionService.all, 'id');
						//var resultatsById = _.indexBy(ResultatService.all, 'id');

						//---------------linkModels-----------------------
						ActionService.linkModels(positionsById);
						PerformanceService.linkModels(actionsById);
						ResultatService.linkModels(actionsById, joueursById);

						DonneesService.updateDataSets(coach.filterData);
						if (coach.donneesServiceForStat === null) {
							coach.donneesServiceForStat = angular.copy(DonneesService);
						}
						coach.loading = false;
					}
				});
			});
		}
	}

})();
