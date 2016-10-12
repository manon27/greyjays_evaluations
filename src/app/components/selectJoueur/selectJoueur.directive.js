(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("selectJoueur", selectJoueur);

	/**
	 * GUI de sélection d'un joueur
	 * @desc <select-joueur items="" selected=""></select-joueur>
	 * @param {Object} $rootScope
	 * @returns	{directive}
	 */

	/** @ngInject */
	function selectJoueur($rootScope) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				selected: "="
			},
			templateUrl: 'app/components/selectJoueur/selectJoueur.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.items = scope.items || [];

			/**
			 * Sélectionner un joueur at actualiser les données
			 * @param {Object} item - joueur selectionné
			 */
			scope.selectionner = function(item) {
				scope.$parent.filterData.joueurIds.push(item.id);
				scope.selected=true;
				scope.estOuvert = false;
				$rootScope.$broadcast('refresh');
			};

			/**
			 * Déselectionner un joueur at actualiser les données
			 */
			scope.deselectionner = function() {
				scope.$parent.filterData.joueurIds=[];
				scope.selected=false;
				$rootScope.$broadcast('refresh');
			};

		}
	}

})();
