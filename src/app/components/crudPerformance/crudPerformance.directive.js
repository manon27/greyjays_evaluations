(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudPerformance", crudPerformance);

	/**
	 * GUI de gestion CRUD des performances
	 * @desc <crud-performance items="" le-service="" all-actions=""></crud-performance>
	 * @param {service} ActionService - Service afficher la liste des actions pour une perf
	 * @param {module} _
	 * @returns {directive}	
	 */

	/** @ngInject */
	function crudPerformance(ActionService, _) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '=',
				allActions: '='
			},
			templateUrl: 'app/components/crudPerformance/crudPerformance.tpl.html',
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
			scope.actionSel = "-1";
			scope.maxSize = 5;
			scope.itemsPerPage = 20;
			scope.currentPage = 1;
			scope.count = 1000;
				
			/**
			 * Surveiller les modifications sur les items
			 * @param {Object[]} items - nouvelle valeur
			 */	
			scope.$watch('items', function(newList){
				scope.itemsF = newList;
				scope.count = newList.length;
				filtrer(scope.actionSel);
			});

			/**
			 * Surveiller les modifications sur actionSel
			 * @param {string} actionSel
			 */
			scope.$watch('actionSel', function(newVal){
				filtrer(newVal);
			});

			/**
			 * Filtrer les items en fonction d'une action
			 * @param {Number} actionS - id de l'action selectionnee
			 */	
			var filtrer = function(actionS) {
				if (actionS == "-1") {
					scope.itemsF = scope.items;
				} else {
					scope.itemsF = _.filter(scope.items, function(item) {
						return item.action.id == actionS;
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
				scope.alertesPerformance=false;
				scope.itemAdd = {
					"id_action": ""
				};
				scope.affichage = {
					"add" : true,
					"upd" : false,
					"liste": false
				};
			};

			/**
			 * Afficher la GUI de modif
			 * @param {Object} it - position à modifier
			 */
			scope.afficherModification = function(it) {
				scope.alertesPerformance=false;
				scope.itemAdd = {
					"id": it.id,
					"libelle": it.libelle,
					"id_action": it.id_action,
					"note": it.note
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
				scope.alertesPerformance=true;
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
			 * Effacer une performance
			 * @param {Object} itemDel - performance à supprimer
			 */
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id);
			};

		}
	}

})();
