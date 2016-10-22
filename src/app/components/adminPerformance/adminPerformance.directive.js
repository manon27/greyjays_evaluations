(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("adminPerformance", adminPerformance);

	/**
	 * GUI de gestion CRUD des performances
	 * @desc <admin-performance items="" le-service="" all-actions=""></admin-performance>
	 * @returns {directive}	
	 */

	/** @ngInject */
	function adminPerformance() {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '=',
				allActions: '='
			},
			templateUrl: 'app/components/adminPerformance/adminPerformance.tpl.html',
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
