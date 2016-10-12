(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('AccueilController', AccueilController);

	/**
	 * Controlleur pour la page d'accueil
	 * @param {Object} $scope
	 * @param {Object} $cookies
	 * @param {module} _ - librairie underscore
	 * @param ...
	 */
	/** @ngInject */
	function AccueilController($scope, $cookies, _, ActionService, JoueurService, PerformanceService, PositionService, ResultatService, DonneesService) {

		var accueil = $scope;

		accueil.isLogged = false;
		if (typeof $cookies.getObject("gjSession") !== 'undefined') {
			accueil.isLogged = true;
		}

		accueil.loading = true;

		DonneesService.updateDataSets();

		init();

		// declaration des services dans le scope pour pouvoir les utiliser dans la vue
		accueil.actionService = ActionService;
		accueil.joueurService = JoueurService;
		accueil.performanceService = PerformanceService;
		accueil.positionService = PositionService;
		accueil.resultatService = ResultatService;
		accueil.donneesService = DonneesService;

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
						accueil.loading = false;
					}
				});
			});
		}

	}

})();
