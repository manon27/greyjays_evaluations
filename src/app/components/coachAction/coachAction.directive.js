(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("coachAction", coachAction);

	/**
	 * GUI de gestion CRUD des actions
	 * @desc <crud-action items="" le-service=""></crud-action>
	 * @param {module} _
	 * @returns {directive}
	 */

	/** @ngInject */
	function coachAction($rootScope, PositionService) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '=',
				filterProperty: '@'
			},
			templateUrl: 'app/components/coachAction/coachAction.tpl.html',
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
			scope.positionSelected = 0;
			
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
				scope.positionSelected = getPositionFromFilterData();
			});

			/**
			 * Afficher la GUI d'ajout
			 */
			scope.afficherAjout = function() {
				scope.alertes=false;
				scope.itemAdd = {
					mesurable: 0,
					id_position: scope.positionSelected.id
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
					description: it.description,
					mesurable: it.mesurable,
					id_position: it.id_position
				};
				scope.positionSelected = PositionService.filtrerParId(it.id_position);
				scope.affichage = {
					liste: false,
					add : false,
					upd : true,
					view: false
				};
			};

			/**
			 * Sauvegarder les donnees
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
				scope.positionSelected = getPositionFromFilterData();
			};

			/**
			 * Effacer l'action
			 * @param {Object} itemDel - action à supprimer
			 */
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id);
			};

			var getPositionFromFilterData = function() {
				var tabPositionId = scope.$parent.filterData.positionIds;
				if (tabPositionId.length > 0) {
					return PositionService.filtrerParId(tabPositionId[0]);
				} else {
					return 0;
				}
			};

		}
	}

})();
