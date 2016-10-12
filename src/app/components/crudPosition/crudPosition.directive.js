(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudPosition", crudPosition);

	/**
	 * GUI de gestion CRUD des positions
	 * @desc <crud-position items="" le-service=""></crud-position>
	 */

	/** @ngInject */
	function crudPosition() {
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

			scope.affichage = {
				"add" : false,
				"upd" : false,
				"liste": true
			};
			scope.items = scope.items || [];
			scope.itemAdd = {};
			scope.maxSize = 5;
			scope.itemsPerPage = 20;
			scope.currentPage = 1;
			scope.count = 1000;
			
			/**
			 * Surveiller les modifications sur les items
			 * @param {Object[]} items - nouvelle valeur
			 */	
			scope.$watch('items', function(newList) {
				scope.count = newList.length;
			});

			/**
			 * Lister les items en fonction de la pagination
			 */	
			scope.pageItems = function() {
				var start = (scope.currentPage - 1) * parseInt(scope.itemsPerPage, 10);
				var limit = parseInt(scope.itemsPerPage, 10);
				var lesItems = scope.items.slice(start, start + limit);
				return lesItems;
			};

			/**
			 * Affichaer la GUI d'ajout
			 */
			scope.afficherAjout = function() {
				scope.alertesPosition=false;
				scope.itemAdd = {};
				scope.affichage = {
					"add" : true,
					"upd" : false,
					"liste": false
				};
			};

			/**
			 * Afficher la GUI de modification
			 * @param {Object} it - position à modifier
			 */
			scope.afficherModification = function(it) {
				scope.alertesPosition=false;
				scope.itemAdd = {
					"id": it.id,
					"libelle": it.libelle,
					"description": it.description
				};
				scope.affichage = {
					"add" : false,
					"upd" : true,
					"liste": false
				};
			};

			/**
			 * Enregistrer
			 * @param {boolean} estValide -
			 */
			scope.enregistrer = function(estValide) {
				scope.alertesPosition=true;
				if (estValide) {
					var itemAjout = {};
					itemAjout=scope.itemAdd;
					if (typeof scope.itemAdd.id !== 'undefined') {
						itemAjout.id=scope.itemAdd.id;
					}
					scope.leService.save(itemAjout);
					scope.affichage = {
						"add" : false,
						"upd" : false,
						"liste": true
					};
				} else {
					return false;
				}
			};

			/**
			 * Masquer les interfaces add et upd
			 */
			scope.annuler = function() {
				scope.affichage = {
					"add" : false,
					"upd" : false,
					"liste": true
				};
			};

			/**
			 * Effacer un joueur
			 * @param {Object} itemDel - position à supprimer
			 */
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id);
			};

		}
	}

})();
