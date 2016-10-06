(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("mesResultats", mesResultats);

	/**
	@name		mesResultats
	@desc 		<mes-resultats items="" le-service="" joueur-sel=""></mes-resultats>
	@param		Services pour les listes liées
	@returns	GUI de gestion CRUD des positions
	*/

	/** @ngInject */
	function mesResultats(ActionService, JoueurService, PerformanceService, _) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '=',
				joueurSel: '='
			},
			templateUrl: 'app/components/mesResultats/mesResultats.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.items = scope.items || [];
			scope.itemsF = [];
			scope.allActions = ActionService.all;
			scope.actionSel = "-1";
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
				scope.itemsF = newList;
				scope.count = scope.itemsF.length;
				filtrer(scope.actionSel,scope.joueurSel);
			});

			/**
			@name		watcher
			@desc 		surveille les modifications sur actionSel
						et filtre les items
			@param		newVal	nouvelle valeur
			@return 	void
			*/	
			scope.$watch('actionSel', function(newVal){
				filtrer(newVal,scope.joueurSel);
			});

			/**
			@name		filtrer
			@desc 		filtre les items en fonction des params
			@param		actionS	action selectionnee
			@param 		joueurS joueur selectionne
			@return 	void
			*/	
			var filtrer = function(actionS, joueurS) {
				if (joueurS == "-1") {
					if (actionS == "-1") {
						scope.itemsF = scope.items;
					} else {
						scope.itemsF = _.filter(scope.items, function(item) {
							return item.action.id == actionS;
						});
					}
				} else {
					scope.itemsF = _.filter(scope.items, function(item) {
						return item.joueur.id == joueurS;
					});
					if (actionS != "-1") {
						scope.itemsF = _.filter(scope.itemsF, function(item) {
							return item.action.id == actionS;
						});
					}
				}
				scope.count = scope.itemsF.length;
			};

			/**
			@name		pageItems
			@desc 		liste des items en fonction de la pagination
			@return 	lesItems à afficher
			*/	
			scope.pageItems = function() {
				var start = (scope.currentPage - 1) * parseInt(scope.itemsPerPage, 10);
				var limit = parseInt(scope.itemsPerPage, 10);
				var lesItems = scope.itemsF.slice(start, start + limit);
				return lesItems;
			};

		}
	}

})();
