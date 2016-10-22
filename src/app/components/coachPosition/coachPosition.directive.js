(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("coachPosition", coachPosition);

	/**
	 * GUI de gestion CRUD des positions
	 * @desc <coach-position items=""></coach-position>
	 */

	/** @ngInject */
	function coachPosition($rootScope) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '=',
				filterProperty: '@'
			},
			templateUrl: 'app/components/coachPosition/coachPosition.tpl.html',
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
			 * Afficher la GUI d'ajout
			 */
			scope.afficherAjout = function() {
				scope.alertes=false;
				scope.itemAdd = {};
				scope.affichage = {
					liste: false,
					add : true,
					upd : false,
					view: false
				};
			};

			/**
			 * Afficher la GUI de modification
			 * @param {Object} it - position à modifier
			 */
			scope.afficherModification = function(it) {
				scope.alertes=false;
				scope.itemAdd = {
					"id": it.id,
					"libelle": it.libelle,
					"description": it.description
				};
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
					itemAjout=scope.itemAdd;
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
