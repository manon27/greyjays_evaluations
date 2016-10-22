(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("adminPosition", adminPosition);

	/**
	 * GUI de gestion CRUD des positions
	 * @desc <admin-position items="" le-service=""></admin-position>
	 * @returns {directive}	
	 */

	/** @ngInject */
	function adminPosition() {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '='
			},
			templateUrl: 'app/components/adminPosition/adminPosition.tpl.html',
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
