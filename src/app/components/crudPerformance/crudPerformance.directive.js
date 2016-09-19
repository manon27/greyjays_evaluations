(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudPerformance", crudPerformance);

	/**
	@name		crudPerformance
	@desc 		<crud-performance items="" le-service=""></crud-performance>
	@param		service ActionService pour afficher la liste des actions pour une perf
	@returns	GUI de gestion CRUD des performances
	*/

	/** @ngInject */
	function crudPerformance(ActionService, _) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '='
			},
			templateUrl: 'app/components/crudPerformance/crudPerformance.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.affichage={};
			scope.affichage.add=false;
			scope.affichage.upd=false;
			scope.affichage.liste=true;
			scope.items = scope.items || [];
			scope.itemAdd = {};
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
			scope.$watch('items', function(newList){
				scope.itemsF = newList;
				scope.count = newList.length;
			});

			/**
			@name		watcher
			@desc 		surveille les modifications sur actionSel
						et filtre les items
			@param		newVal	nouvelle valeur
			@return 	void
			*/	
			scope.$watch('actionSel', function(newVal){
				if (newVal == "-1") {
					scope.itemsF = scope.items;
				} else {
					scope.itemsF = _.filter(scope.items, function(item) {
						return item.action.id == newVal;
					});
				}
				scope.count = scope.itemsF.length;
			});

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

			/**
			@name	afficherAjout
			@desc 	affichage de la GUI d'ajout avec init du param
			*/
			scope.afficherAjout = function() {
				scope.alertesPerformance=false;
				scope.itemAdd = {};
				scope.affichage.add=true;
				scope.affichage.upd=false;
			};

			/**
			@name		afficherModification
			@desc 		affichage de la GUI de modif
			@param	 	it : item de position
			*/
			scope.afficherModification = function(it) {
				scope.alertesPerformance=false;
				scope.itemAdd = {};
				for (var noeud in it) {
					if (angular.isString(it[noeud])) {
						scope.itemAdd[noeud] = it[noeud];
					}
					if (angular.isNumber(it[noeud])) {
						scope.itemAdd[noeud] = it[noeud];
					}
				}
				scope.affichage.add=false;
				scope.affichage.upd=true;
			};

			/**
			@name		enregistrer
			@desc 		appel du service save + refresh via la root
			*/
			scope.enregistrer = function(estValide) {
				scope.alertesPerformance=true;
				if (estValide) {
					var itemAjout = {};
					itemAjout = scope.itemAdd;
					if (typeof scope.itemAdd.id !== 'undefined') {
						itemAjout.id=scope.itemAdd.id;
					}
					scope.leService.save(itemAjout);
					scope.affichage.add=false;
					scope.affichage.upd=false;
				} else {
					return false;
				}
			};

			/**
			@name 	annuler
			@desc 	Masquer les interfaces add et upd
			*/
			scope.annuler = function() {
				scope.affichage.add=false;
				scope.affichage.upd=false;
			};

			/**
			@name 	effacer
			@desc 	Appel du service (service.delete)
			*/
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id);
			};

		}
	}

})();
