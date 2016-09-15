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
	function crudPerformance(ActionService) {
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
				
			scope.$watch('actionSel', function(newPos){
				if (newPos == "-1") {
					scope.itemsF = scope.items;
				} else {
					scope.itemsF = _.filter(scope.items, function(item) {
						return item.action.id == newPos;
					});
				}
			});

			/**
			@name	afficherAjout
			@desc 	affichage de la GUI d'ajout avec init du param
			*/
			scope.afficherAjout = function() {
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
				scope.itemAdd = {};
				for (var noeud in it) {
					if (angular.isString(it[noeud])) {
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
			scope.enregistrer = function() {
				var itemAjout = {};
				itemAjout = scope.itemAdd;
				if (typeof scope.itemAdd.id !== 'undefined') {
					itemAjout.id=scope.itemAdd.id;
				}
				scope.leService.save(itemAjout);
				scope.affichage.add=false;
				scope.affichage.upd=false;
				
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
