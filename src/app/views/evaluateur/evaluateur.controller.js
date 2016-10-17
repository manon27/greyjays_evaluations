(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('EvaluateurController', EvaluateurController);

	/**
	 * Controlleur pour la page de l'evaluateur
	 * @param {Object} $scope
	 * @param {Object} $q
	 * @param {module} _ - librairie underscore
	 * @param ...
	 */

	/** @ngInject */
	function EvaluateurController($scope, $q, _, ActionService, JoueurService, PerformanceService, PositionService, ResultatService, DonneesService) {

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

		init();

		// declaration des services dans le scope pour pouvoir les utiliser dans la vue
		evaluateur.actionService = ActionService;
		evaluateur.joueurService = JoueurService;
		evaluateur.performanceService = PerformanceService;
		evaluateur.positionService = PositionService;
		evaluateur.resultatService = ResultatService;
		evaluateur.donneesService = DonneesService;
		
		evaluateur.$on('filtrerDatas', function() {
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

						DonneesService.updateDataSets(evaluateur.filterData);

						evaluateur.loading = false;
					}
				});
			});
		}

	}

})();
