(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("coachPerformance", coachPerformance);

	/**
	 * GUI de gestion CRUD des performances
	 * @desc <crud-performance items="" le-service="" all-actions=""></crud-performance>
	 * @param {service} ActionService - Service afficher la liste des actions pour une perf
	 * @param {module} _
	 * @returns {directive}	
	 */

	/** @ngInject */
	function coachPerformance($rootScope, ActionService) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '=',
				filterProperty: '@'
			},
			templateUrl: 'app/components/coachPerformance/coachPerformance.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.affichage = {
				liste: true,
				add : false,
				upd : false,
				view: false
			};
			scope.alertes = false;
			scope.itemAdd = {};
			scope.items = scope.items || [];
			scope.itemSelected = {};
			scope.actionSelected = 0;
			
			/**
			 * Selectionner
			 */
			scope.selectionner = function(it) {
				scope.itemSelected = it;
				scope.$parent.filterData[scope.filterProperty].push(it.id);
				$rootScope.$broadcast('filtrerDatas');
				scope.affichage = {
					liste: false,
					add : false,
					upd : false,
					view: true
				};
			};

			/**
			 * Déselectionner
			 */
			scope.deselectionner = function() {
				scope.itemSelected = {};
				scope.$parent.filterData[scope.filterProperty] = [];
				$rootScope.$broadcast('filtrerDatas');
				scope.affichage = {
					liste: true,
					add : false,
					upd : false,
					view: false
				};
			};
			
			/**
			 * surveiller les modifications sur les items
			 * @param {Object[]} items
			 */
			scope.$watch('items', function(newList){
				scope.itemsF = newList;
				scope.actionSelected = getActionFromFilterData();
			});
			

			/**
			 * Afficher la GUI d'ajout
			 */
			scope.afficherAjout = function() {
				scope.alertes=false;
				scope.itemAdd = {
					id_action: scope.actionSelected.id
				};
				scope.affichage = {
					liste: false,
					add : true,
					upd : false,
					view: false
				};
			};

			/**
			 * Afficher la GUI de modification
			 * @param {Object} it - la position à modifier
			 */
			scope.afficherModification = function(it) {
				scope.alertes=false;
				scope.itemAdd = {
					id: it.id,
					libelle: it.libelle,
					note: it.note,
					id_action: it.id_action
				};
				scope.actionSelected = ActionService.filtrerParId(it.id_action);
				scope.affichage = {
					liste: false,
					add : false,
					upd : true,
					view: false
				};
			};

			/**
			 * Enregistrer
			 * @param {boolean} estValide - 
			 */
			scope.enregistrer = function(estValide) {
				scope.alertes=true;
				if (estValide) {
					var itemAjout = {};
					itemAjout = scope.itemAdd;
					if (typeof scope.itemAdd.id !== 'undefined') {
						itemAjout.id=scope.itemAdd.id;
					}
					scope.leService.save(itemAjout);
					scope.affichage = {
						liste: true,
						add : false,
						upd : false,
						view: false
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
					liste: true,
					add : false,
					upd : false,
					view: false
				};
				scope.actionSelected = getActionFromFilterData();
			};

			/**
			 * Effacer une performance
			 * @param {Object} itemDel - performance à supprimer
			 */
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id);
			};

			var getActionFromFilterData = function() {
				var tabActionId = scope.$parent.filterData.actionIds;
				if (tabActionId.length > 0) {
					return ActionService.filtrerParId(tabActionId[0]);
				} else {
					return 0;
				}
			};

		}
	}

})();
