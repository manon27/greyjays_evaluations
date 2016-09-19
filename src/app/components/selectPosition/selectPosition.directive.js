(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("selectPosition", selectPosition);

	/**
	@name		selectPosition
	@desc 		<select-position items leService></select-position>
	@returns	GUI de selection de la position sur le terrain
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
			@name		selectionner
			@desc 		
			*/
			scope.selectionner = function(item) {
				scope.$parent.filterData.positionIds.push(item.id);
				scope.selected=true;
				scope.estOuvert = false;
				$rootScope.$broadcast('refresh');
			};

			scope.deselectionner = function() {
				scope.$parent.filterData.positionIds=[];
				scope.selected=false;
				$rootScope.$broadcast('refresh');
			};
		}
	}

})();