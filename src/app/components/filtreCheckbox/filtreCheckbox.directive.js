(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive('filtreCheckbox', filtreCheckbox);

	/** @ngInject */
	function filtreCheckbox($rootScope, _) {
		return {
			restrict: 'E',
			scope: {
				items: '=',
				filterProperty: '@',
				chargement: '='
			},
			templateUrl: 'app/components/filtreCheckbox/filtreCheckbox.tpl.html',
			link: function(scope) {

				
				scope.items = scope.items || [];

				scope.$watch('items', function() {
					if (scope.items.length > 0) {
						_.each(scope.items, function(item) {
							if (_.contains(scope.$parent.filterData[scope.filterProperty], item.id)) {
								item.coche = true;
							} else {
								item.coche = false;
							}
						});
					}
				});
				scope.cocherItem = function(checkedItem) {
					if (_.contains(scope.$parent.filterData[scope.filterProperty], checkedItem.id)) {
						checkedItem.coche = false;

						scope.$parent.filterData[scope.filterProperty] = _.filter(scope.$parent.filterData[scope.filterProperty], function(item) {
							return item != checkedItem.id;
						});
					} else {
						checkedItem.coche = true;
						scope.$parent.filterData[scope.filterProperty].push(checkedItem.id);
					}
					$rootScope.$broadcast('filtrerDatas');
				};

			}
		};
	}
})();
