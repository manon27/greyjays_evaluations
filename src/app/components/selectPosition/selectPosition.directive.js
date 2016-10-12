(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("selectPosition", selectPosition);

	/**
	 * GUI de selection de la position sur le terrain
	 * @desc <select-position items="" selected=""></select-position>
	 * @param {Object} $rootScope
	 * @returns	{directive}
	 */

	/** @ngInject */
	function selectPosition($rootScope) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				selected: '='
			},
			templateUrl: 'app/components/selectPosition/selectPosition.tpl.html',
			link: linkF
		};
		return directive;

		function linkF(scope) {

			scope.items = scope.items || [];

			/**
			 * Sélectionner une position et actualiser les données
			 * @param {Object} item - position selectionnée
			 */
			scope.selectionner = function(item) {
				scope.$parent.filterData.positionIds.push(item.id);
				scope.selected=true;
				scope.estOuvert = false;
				$rootScope.$broadcast('refresh');
			};

			/**
			 * Désélectionner
			 */
			scope.deselectionner = function() {
				scope.$parent.filterData.positionIds=[];
				scope.selected=false;
				$rootScope.$broadcast('refresh');
			};
		}
	}

})();
