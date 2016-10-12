(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("selectAction", selectAction);

	/**
	 * GUI de sélection d'une action
	 * @desc <select-action items="" selected=""></select-action>
	 * @param {Object} $rootScope
	 * @returns	{directive}
	 */

	/** @ngInject */
	function selectAction($rootScope) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				selected: '='
			},
			templateUrl: 'app/components/selectAction/selectAction.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.items = scope.items || [];

			/**
			 * Sélectionner l'action et actualiser les données
			 * @param {Object} item - action selectionnée
			 */
			scope.selectionner = function(item) {
				scope.$parent.filterData.actionIds.push(item.id);
				scope.selected=true;
				scope.estOuvert = false;
				$rootScope.$broadcast('refresh');
			};

			/**
			 * Déselectionner l'action et actualiser les données
			 */
			scope.deselectionner = function() {
				scope.$parent.filterData.actionIds=[];
				scope.selected=false;
				$rootScope.$broadcast('refresh');
			};
		}
	}

})();
