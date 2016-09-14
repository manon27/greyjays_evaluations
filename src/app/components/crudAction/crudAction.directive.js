(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudAction", crudAction);

	/**
	@name		crudAction
	@desc 		<crud-action items="" le-service=""></crud-position>
	@param		rootScope pour appeler la fonction refresh du scope root
	@returns	GUI de gestion CRUD des positions
	*/

	/** @ngInject */
	function crudAction(PositionService) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '='
			},
			templateUrl: 'app/components/crudAction/crudAction.tpl.html',
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
			
			/**
			@name	afficherAjout
			@desc 	affichage de la GUI d'ajout avec init du param
			*/
			scope.afficherAjout = function() {
				scope.itemAdd = {};
				scope.allPositions = PositionService.all;
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
				scope.allPositions = PositionService.all;
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
