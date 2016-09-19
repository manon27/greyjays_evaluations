(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("selectAction", selectAction);

	/**
	@name		selectAction
	@desc 		<select-action items="" tab=""></select-position>
	@param		
	@returns	GUI de gestion CRUD des actions
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
			@name		selectionner
			@desc 		filtre des donnees selon l action
			@param 		item : action selectionnée
			@return 	void
			*/
			scope.selectionner = function(item) {
				scope.$parent.filterData.actionIds.push(item.id);
				scope.selected=true;
				scope.estOuvert = false;
				$rootScope.$broadcast('refresh');
			};

			/**
			@name		deselectionner
			@desc 		supprimer le filtre des donnees selon l action
			@return 	void
			*/
			scope.deselectionner = function() {
				scope.$parent.filterData.actionIds=[];
				scope.selected=false;
				$rootScope.$broadcast('refresh');
			};
		}
	}

})();
