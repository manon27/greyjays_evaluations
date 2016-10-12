(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudAction", crudAction);

	/**
	 * GUI de gestion CRUD des actions
	 * @desc <crud-action items="" le-service="" all-positions=""></crud-action>
	 * @param {module} _
	 * @returns {directive}
	 */

	/** @ngInject */
	function crudAction(_) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '=',
				allPositions: '='
			},
			templateUrl: 'app/components/crudAction/crudAction.tpl.html',
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
			scope.itemsF = [];
			scope.itemAdd = {};
			scope.positionSel = "-1";
			scope.maxSize = 5;
			scope.itemsPerPage = 20;
			scope.currentPage = 1;
			scope.count = 1000;
			
			/**
			 * surveiller les modifications sur les items
			 * @param {Object[]} items
			 */
			scope.$watch('items', function(newList){
				scope.itemsF = newList;
				scope.count = newList.length;
				filtrer(scope.positionSel);
			});

			/**
			 * Surveiller les modifications sur la positionSel
			 * @param {string} positionSel
			 */
			scope.$watch('positionSel', function(newVal){
				filtrer(newVal);
			});

			/**
			 * Filtrer les items en fonction des params
			 * @param {string} positionS - position selectionnee
			 */	
			var filtrer = function(positionS) {
				if (positionS == "-1") {
					scope.itemsF = scope.items;
				} else {
					scope.itemsF = _.filter(scope.items, function(item) {
						return item.position.id == positionS;
					});
				}
				scope.count = scope.itemsF.length;
			};

			/**
			 * Lister les items en fonction de la pagination
			 */
			scope.pageItems = function() {
				var start = (scope.currentPage - 1) * parseInt(scope.itemsPerPage, 10);
				var limit = parseInt(scope.itemsPerPage, 10);
				var lesItems = scope.itemsF.slice(start, start + limit);
				return lesItems;
			};

			/**
			 * Afficher la GUI d'ajout
			 */
			scope.afficherAjout = function() {
				scope.alertesAction=false;
				scope.itemAdd = {
					"mesurable": 0,
					"id_position": ""
				};
				scope.affichage = {
					"add" : true,
					"upd" : false,
					"liste": false
				};
			};

			/**
			 * Afficher la GUI de modification
			 * @param {Object} it - la position à modifier
			 */
			scope.afficherModification = function(it) {
				scope.alertesAction=false;
				scope.itemAdd = {
					"id": it.id,
					"libelle": it.libelle,
					"description": it.description,
					"mesurable": it.mesurable,
					"id_position": it.id_position
				};
				scope.affichage = {
					"add" : false,
					"upd" : true,
					"liste": false
				};
			};

			/**
			 * Sauvegarder les donnees
			 * @param {boolean} estValide - 
			 */
			scope.enregistrer = function(estValide) {
				scope.alertesAction=true;
				if (estValide) {
					var itemAjout = {};
					itemAjout = scope.itemAdd;
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
			 * Effacer l'action
			 * @param {Object} itemDel - action à supprimer
			 */
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id);
			};

		}
	}

})();
