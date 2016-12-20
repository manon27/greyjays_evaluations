(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('JoueurController', JoueurController);

	/**
	 * Controlleur pour la page du joueur
	 * @param {Object} $scope
	 * @param {Object} $routeParams
	 * @param {Object} $q
	 * @param {module} _ - librairie underscore
	 * @param ...
	 */

	/** @ngInject */
	function JoueurController($scope, $routeParams, $q, _, ActionService, JoueurService, PerformanceService, PositionService, ResultatService, DonneesService) {

		var joueurCtrl = $scope;

		joueurCtrl.loading = true;

		//initialisation des filtres pour chaque entite
		joueurCtrl.filterData = {
			actionIds: [],
			joueurIds: [],
			performanceIds: [],
			positionIds: [],
			resultatIds: []
		};


		init();

		DonneesService.updateDataSets(joueurCtrl.filterData);

		// declaration des services dans le scope pour pouvoir les utiliser dans la vue
		joueurCtrl.donneesService = DonneesService;
		joueurCtrl.actionService = ActionService;
		joueurCtrl.joueurService = JoueurService;
		joueurCtrl.performanceService = PerformanceService;
		joueurCtrl.positionService = PositionService;
		joueurCtrl.resultatService = ResultatService;
		
		/**
		 *	Filtrer après sélection
		 */
		joueurCtrl.$on('filtrerDatas', function() {
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
			joueurCtrl.loading = true;

			applyRefresh().then(function() {
				//	Calculs en cours termine
				joueurCtrl.loading = false;
			});
		});

		/**
		 *	Rafraichir apres appel ajax
		 */
		joueurCtrl.$on('refresh', function() {
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
			joueurCtrl.loading = true;

			applyRefresh().then(function() {
				//	Calculs en cours termine
				joueurCtrl.loading = false;
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
						joueurCtrl.filterData.joueurIds[0] = parseInt($routeParams.id,10);
						DonneesService.updateDataSets(joueurCtrl.filterData);

						joueurCtrl.loading = false;
					}
				});
			});
		}

	}

})();
