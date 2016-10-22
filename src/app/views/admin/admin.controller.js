(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('AdminController', AdminController);

	/**
	 * Controlleur pour la page d'admin'
	 * @param {Object} $scope
	 * @param {Object} $q
	 * @param {module} _ - librairie underscore
	 * @param ...
	 */

	/** @ngInject */
	function AdminController($scope, $q, _, ActionService, JoueurService, PerformanceService, PositionService, ResultatService, DonneesService) {

		var admin = $scope;

		admin.loading = true;

		DonneesService.updateDataSets();

		init();

		// declaration des services dans le scope pour pouvoir les utiliser dans la vue
		admin.actionService = ActionService;
		admin.joueurService = JoueurService;
		admin.performanceService = PerformanceService;
		admin.positionService = PositionService;
		admin.resultatService = ResultatService;
		admin.donneesService = DonneesService;
		
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

						DonneesService.updateDataSets();
						admin.loading = false;
					}
				});
			});
		}

		admin.$on('refresh', function() {
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
			admin.loading = true;

			applyRefresh().then(function() {
				//	Calculs en cours termine
				admin.loading = false;
			});
		});

	}

})();
