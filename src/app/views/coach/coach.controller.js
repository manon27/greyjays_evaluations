(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('CoachController', CoachController);

	/** @ngInject */
	function CoachController($scope, $rootScope, $location, $q, _, ActionService, JoueurService, PerformanceService, PositionService, ResultatService, DonneesService) {

		var coach = $scope;

		coach.loading = true;

		DonneesService.updateDataSets();

		coach.actionService = ActionService;
		coach.joueurService = JoueurService;
		coach.performanceService = PerformanceService;
		coach.positionService = PositionService;
		coach.resultatService = ResultatService;

		init();

		//Bind component data services to the scope, so we can use them in the views
		coach.donneesService = DonneesService;
		
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
		@name		init
		@desc 		actualisation des données via les services
		@return 	void
		*/
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

						DonneesService.updateDataSets();
						coach.loading = false;
					}
				});
			});
		}
	}

})();
