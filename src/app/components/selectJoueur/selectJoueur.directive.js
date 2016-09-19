(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("selectJoueur", selectJoueur);

	/**
	@name		selectJoueur
	@desc 		<select-joueur items="" le-service=""></select-position>
	@param		filter
	@returns	GUI de gestion CRUD des joueurs
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
			@name		selectionner
			@desc 		filtre des donnees selon le joueur
			@param 		item : joueur selectionné
			@return 	void
			*/
			scope.selectionner = function(item) {
				scope.$parent.filterData.joueurIds.push(item.id);
				scope.selected=true;
				scope.estOuvert = false;
				$rootScope.$broadcast('refresh');
			};

			/**
			@name		deselectionner
			@desc 		supprimer le filtre des donnees selon la position
			@return 	void
			*/
			scope.deselectionner = function() {
				scope.$parent.filterData.joueurIds=[];
				scope.selected=false;
				$rootScope.$broadcast('refresh');
			};

		}
	}

})();
