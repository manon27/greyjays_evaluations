(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive('filtreSelect', filtreSelect);

	/**
	 * Affichage d'une liste d'éléments pour filtrer
	 * @desc <filtre-select></filtre-select>
	 * @param {service} PositionService - 
	 * @param {module} _
	 */

	/** @ngInject */
	function filtreSelect($rootScope, _) {
		return {
			restrict: 'E',
			scope: {
				items: '=',
				defaultOption: '@',
				filterProperty: '@',
				total: '=',
				chargement: '='
			},
			templateUrl: 'app/components/filtreSelect/filtreSelect.tpl.html',
			link: function(scope) {

				scope.items = scope.items || [];
				scope.itemsOption = [];
				scope.selectedItemId = 0;
				scope.selectedItem = {};
				
				scope.$watch('items', function(newVals) {
					if (newVals.length > 0) {
						scope.itemsOption = [];
						_.each(newVals, function(item) {
							var myItem = {
								id: item.id,
								libelle: item.libelle,
								description: item.description
							};
							scope.itemsOption.push(myItem);
							if (_.contains(scope.$parent.filterData[scope.filterProperty], item.id)) {
								scope.selectedItemId = item.id;
								scope.selectedItem = {
									libelle: item.libelle,
									description: item.description
								};
							}
						});
					}
				});

				scope.$watch('selectedItemId', function(newVal) {
					if (newVal !== 0) {
						_.each(scope.items, function(item) {
							if (item.id === newVal) {
								scope.selectedItem = {
									libelle: item.libelle,
									description: item.description
								};
							}
						});
						scope.$parent.filterData[scope.filterProperty].push(newVal);
						$rootScope.$broadcast('filtrerDatas');
					}
				});

				scope.deselectionnerItem = function() {
					scope.selectedItemId = 0;
					scope.selectedItem = {};
					scope.$parent.filterData[scope.filterProperty] = [];
					$rootScope.$broadcast('filtrerDatas');
				};

			}
		};
	}
})();
