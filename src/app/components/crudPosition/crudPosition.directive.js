(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudPosition", crudPosition);

	/**
	@name		crudPosition
	@desc 		<crud-position items="" le-service=""></crud-position>
	@params		rootScope pour appeler la fonction refresh du scope root
	@returns	GUI de gestion CRUD des positions
	*/

	/** @ngInject */
	function crudPosition($rootScope) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '='
			},
			templateUrl: 'app/components/crudPosition/crudPosition.tpl.html',
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
				scope.affichage.add=true;
				scope.affichage.upd=false;
			};

			/**
			@name		afficherModification
			@desc 		affichage de la GUI de modif
			@params 	it : item de position
			*/
			scope.afficherModification = function(it) {
				scope.itemAdd.id = it.id;
				scope.itemAdd.libelle = it.libelle;
				scope.itemAdd.description = it.description;
				scope.affichage.add=false;
				scope.affichage.upd=true;
			};

			/**
			@name		enregistrer
			@desc 		appel du service save + refresh via la root
			*/
			scope.enregistrer = function() {
				var itemAjout = {};
				itemAjout.libelle = scope.itemAdd.libelle;
				itemAjout.description = scope.itemAdd.description;
				if (typeof scope.itemAdd.id !== 'undefined') {
					itemAjout.id=scope.itemAdd.id;
				}
				scope.leService.save(itemAjout).then(function() {
					$rootScope.$broadcast('refresh');
				});
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
			@desc 	Appel du service (service.delete) + actualisation par le root ($rootScope.$broadcast)
			*/
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id).then(function() {
					$rootScope.$broadcast('refresh');
				});
			};

		}
	}

})();
