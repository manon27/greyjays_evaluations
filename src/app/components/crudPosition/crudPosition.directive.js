(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudPosition", crudPosition);

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
			
			scope.afficherModification = function(it) {
				scope.itemAdd.id = it.id;
				scope.itemAdd.libelle = it.libelle;
				scope.itemAdd.description = it.description;
				scope.affichage.add=false;
				scope.affichage.upd=true;
			};
			scope.afficherAjout = function() {
				scope.itemAdd = {};
				scope.affichage.add=true;
				scope.affichage.upd=false;
			};
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
			scope.annuler = function() {
				scope.affichage.add=false;
				scope.affichage.upd=false;
			};
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id).then(function() {
					$rootScope.$broadcast('refresh');
				});
			};

		}
	}

})();
