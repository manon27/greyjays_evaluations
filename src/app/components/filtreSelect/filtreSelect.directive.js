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
							var myItem = setItem(item);
							scope.itemsOption.push(myItem);
							if (_.contains(scope.$parent.filterData[scope.filterProperty], item.id)) {
								scope.selectedItemId = item.id;
								scope.selectedItem = setItem(item);
							}
						});
					}
				});

				scope.$watch('selectedItemId', function(newVal) {
					if (newVal !== 0) {
						_.each(scope.items, function(item) {
							if (item.id === newVal) {
								scope.selectedItem = setItem(item);
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

				var setItem = function(it) {
					if (it.type === 'joueur') {
						return {id: it.id, label: it.prenom + ' ' + it.nom + ' (' + it.date_naissance + ')', type: it.type};
					} else if (it.type === 'position') {
						return {id: it.id, label: it.libelle + ' - ' + it.description, type: it.type};
					} else if (it.type === 'action') {
						return {id: it.id, label: it.libelle, description: it.description, type: it.type};
					}
				};

			}
		};
	}
})();
