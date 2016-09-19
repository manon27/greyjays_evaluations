(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("listResultat", listResultat);

	/**
	@name		listResultat
	@desc 		<list-resultat items></list-resultat>
	@param		Services pour les listes liées
	@returns	GUI de gestion CRUD des positions
	*/

	/** @ngInject */
	function listResultat(PerformanceService, _) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				joueurSelected: '=',
				actionSelected: '=',
				positionSelected: '='
			},
			templateUrl: 'app/components/listResultat/listResultat.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.items = scope.items || [];
			scope.maxSize = 5;
			scope.itemsPerPage = 20;
			scope.currentPage = 1;
			scope.count = 1000;

			/**
			@name		watcher
			@desc 		surveille les modifications sur les items
			@param		newList	nouvelle valeur
			@return 	void
			*/	
			scope.$watch('items', function(newList) {
				_.each(newList, function(val) {
					var laNote = PerformanceService.getNote(val.id_action, val.performance);
					var aStars = [];
					if (laNote != '???') {
						for (var i=0; i<parseInt(laNote,10) ; i++) {
							aStars.push(""+i);
						}
					}
					val.maNote = aStars;
				});
				scope.count = newList.length;
			});
			
			/**
			@name		pageItems
			@desc 		liste des items en fonction de la pagination
			@return 	lesItems à afficher
			*/	
			scope.pageItems = function() {
				var start = (scope.currentPage - 1) * parseInt(scope.itemsPerPage, 10);
				var limit = parseInt(scope.itemsPerPage, 10);
				var lesItems = scope.items.slice(start, start + limit);
				return lesItems;
			};


		}
	}

})();
