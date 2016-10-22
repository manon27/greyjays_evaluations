(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive('filtreSaison', filtreSaison);

	/**
	 * Affichage d'une liste des saisons pour filtrer
	 * @desc <filtre-saison></filtre-saison>
	 * @param {service} ResultatService - 
	 * @param {module} _
	 */

	/** @ngInject */
	function filtreSaison($rootScope, ResultatService, _) {
		return {
			restrict: 'E',
			templateUrl: 'app/components/filtreSaison/filtreSaison.tpl.html',
			link: function(scope) {

				scope.dateDebutSaison = 0;
				scope.selectedItem = {};

				// construction de la liste des options (saisons)
				scope.itemOptions = [];
				// Toutes saisons
				scope.itemOptions.push({libelle: 'Filtrer sur la saison', dateBegin: 0});

				var lesResultats = _.sortBy(ResultatService.all, 'date_realisation');

				_.each(lesResultats, function(result) {
					var maDate = new Date(result.date_realisation);
					var monAnnee = maDate.getFullYear();
					var monMois = maDate.getMonth();
					var dateBegin;
					if (monMois>=7) { dateBegin = new Date(monAnnee, 7, 1);} else {dateBegin = new Date(monAnnee-1, 7, 1);}
					var recherche = _.find(scope.itemOptions, function(opt) {
						return new Date(opt.dateBegin).getTime() === dateBegin.getTime();
					});
					if (typeof recherche === 'undefined') {
						var anneeD = +dateBegin.getFullYear();
						var anneeF = +dateBegin.getFullYear() + 1;
						scope.itemOptions.push({libelle: 'Saison ' + anneeD +'/'+anneeF, dateBegin: dateBegin.getTime()});
					}
				});

				scope.$watch('dateDebutSaison', function(newVal) {
					if (newVal !== 0) {
						_.each(scope.itemOptions, function(item) {
							if (+item.dateBegin === +newVal) {
								scope.selectedItem = {libelle: item.libelle};
							}
						});
					} else {
						scope.selectedItem = {};
					}
					scope.$parent.dateDebutSaison = +newVal;
					$rootScope.$broadcast('filtrerDatas');
				});

				scope.deselectionnerItem = function() {
					scope.dateDebutSaison = 0;
				};

			}
		};
	}
})();
