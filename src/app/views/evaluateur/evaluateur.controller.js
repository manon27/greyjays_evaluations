(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('EvaluateurController', EvaluateurController);

	/** @ngInject */
	function EvaluateurController($scope, $rootScope, $location, $q, _, ActionService, JoueurService, PerformanceService, PositionService, ResultatService, DonneesService) {

		var evaluateur = $scope;

		evaluateur.loading = true;

		//initialisation des filtres pour chaque entite
		evaluateur.filterData = {
			actionIds: [],
			joueurIds: [],
			performanceIds: [],
			positionIds: [],
			resultatIds: []
		};

		DonneesService.updateDataSets(evaluateur.filterData);

		evaluateur.actionService = ActionService;
		evaluateur.joueurService = JoueurService;
		evaluateur.performanceService = PerformanceService;
		evaluateur.positionService = PositionService;
		evaluateur.resultatService = ResultatService;

		init();

		//Bind component data services to the scope, so we can use them in the views
		evaluateur.donneesService = DonneesService;
		
		evaluateur.$on('refresh', function() {
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
			evaluateur.loading = true;

			applyRefresh().then(function() {
				//	Calculs en cours termine
				evaluateur.loading = false;
			});
		});

		function init() {
			var modelCount = 0;
			var models = [
				ActionService, JoueurService, PerformanceService, PositionService, ResultatService
			];

			_.each(models, function(Model) {
				Model.getAll(false).then(function() {
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
						var performancesById = _.indexBy(PerformanceService.all, 'id');
						var positionsById = _.indexBy(PositionService.all, 'id');
						var resultatsById = _.indexBy(ResultatService.all, 'id');


						//---------------linkModels-----------------------
						ActionService.linkModels(positionsById);
						PerformanceService.linkModels(actionsById);
						ResultatService.linkModels(actionsById, joueursById);

						DonneesService.updateDataSets(evaluateur.filterData);

						evaluateur.loading = false;
					}
				});
			});
		}

	}

})();
