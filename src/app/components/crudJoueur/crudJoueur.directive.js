(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudJoueur", crudJoueur);

	/**
	@name		crudJoueur
	@desc 		<crud-joueur items="" le-service=""></crud-position>
	@param		filter
	@returns	GUI de gestion CRUD des joueurs
	*/

	/** @ngInject */
	function crudJoueur() {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '='
			},
			templateUrl: 'app/components/crudJoueur/crudJoueur.tpl.html',
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
			
			scope.$watch('items', function(newVal) {
				scope.count = newVal.length;
			});

			scope.maxSize = 5;
			scope.itemsPerPage = 20;
			scope.currentPage = 1;
			scope.count = 1000;
			scope.pageItems = function() {
				var start = (scope.currentPage - 1) * parseInt(scope.itemsPerPage, 10);
				var limit = parseInt(scope.itemsPerPage, 10);
				var lesItems = scope.items.slice(start, start + limit);
				return lesItems;
			};

			/**
			@name	afficherAjout
			@desc 	affichage de la GUI d'ajout avec init du param
			*/
			scope.afficherAjout = function() {
				scope.alertesJoueur=false;
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
				scope.alertesJoueur=false;
				scope.itemAdd = {};
				for (var noeud in it) {
					if (angular.isString(it[noeud])) {
						scope.itemAdd[noeud] = it[noeud];
					}
					if (angular.isNumber(it[noeud])) {
						scope.itemAdd[noeud] = it[noeud];
					}
				}
				scope.itemAdd.date_naissance = new Date(scope.itemAdd.date_naissance);
				scope.itemAdd.date_inscription = new Date(scope.itemAdd.date_inscription);
				scope.affichage.add=false;
				scope.affichage.upd=true;
			};

			/**
			@name		enregistrer
			@desc 		appel du service save + refresh via la root
			*/
			scope.enregistrer = function(estValide) {
				scope.alertesJoueur=true;
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