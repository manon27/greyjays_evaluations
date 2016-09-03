(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('MainController', MainController);

	/** @ngInject */
	function MainController($scope, $rootScope, $location, $q, _, PositionService, DonneesService) {

		var main = $scope;

		main.loading = true;

		DonneesService.updateDataSets();

		main.positionService = PositionService;

		var modelCount = 0;
		var models = [
			PositionService
		];

		_.each(models, function(Model) {
			Model.fetch().then(function() {
				modelCount++;
				if (modelCount === models.length) {

					//---------------cleanDatas-----------------------
					PositionService.cleanDatas();

					//---------------indexById-----------------------
					var positionsById = _.indexBy(PositionService.all, 'id');

					//---------------linkModels-----------------------
					/*ProduitService.linkModels(societesById);
					LabellisationService.linkModels(produitsById, versionossById, versiontypelabellisationsById, specialitesById);
					VersionTypeLabellisationService.linkModels(typelabellisationsById);
					CaracteristiqueService.linkModels(labellisationsById);
					CaracteristiqueFiltrableService.linkModels(typelabellisationsById, labellisationsById);*/
					//---------------raccourci dans l url ?-----------------------
					
					//---------------updateDataSets-----------------------
					DonneesService.updateDataSets();
					main.loading = false;
				}
			});
		});

		//Bind component data services to the scope, so we can use them in the views
		main.donneesService = DonneesService;
		
		$scope.$on('refresh', function() {
			var deferred = $q.defer();

			function applyRefresh() {
				_.delay(function() {
					$scope.$apply(function() {
						// mise à jour du jeu de donnees
						DonneesService.updateDataSets();
						deferred.resolve('Finished refresh');
					});
				}, 250);

				return deferred.promise;
			}

			//	Calculs en cours
			main.loading = true;

			applyRefresh().then(function() {
				//	Calculs en cours termine
				main.loading = false;
			});
		});
	}

})();
