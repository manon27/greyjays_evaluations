(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("adminResultat", adminResultat);

	/**
	 * GUI de gestion CRUD des resultats
	 * @desc <admin-resultat items="" le-service="" all-actions="" all-joueurs=""></admin-resultat>
	 * @returns	{directive}
	 */

	/** @ngInject */
	function adminResultat() {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '=',
				allActions: '=',
				allJoueurs: '='
			},
			templateUrl: 'app/components/adminResultat/adminResultat.tpl.html',
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
				scope.alertesResultat=false;
				scope.itemAdd = {};
				scope.itemAdd.date_realisation = new Date();				
				scope.itemAdd.inmatch = 0;				
				scope.itemAdd.performance = "";				
				scope.itemAdd.id_action = "";				
				scope.itemAdd.id_joueur = "";				
				scope.affichage = {
					"add" : true,
					"upd" : false,
					"liste": false
				};
			};

			/**
			 * Afficher la GUI de modif
			 * @param {Object}it - resultat à modifier
			 */
			scope.afficherModification = function(it) {
				scope.alertesResultat=false;
				scope.itemAdd = {
					"id": it.id,
					"id_action": it.id_action,
					"id_joueur": it.id_joueur,
					"performance": it.performance,
					"inmatch": it.inmatch,
					"date_realisation": new Date(it.date_realisation)
				};
				scope.affichage = {
					"add" : false,
					"upd" : true,
					"liste": false
				};
			};

			/**
			 * Enregistrer
			 */
			scope.enregistrer = function(estValide) {
				scope.alertesResultat=true;
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
			 * Effacer
			 * @param {Object} itemDel - Résultat à supprimer
			 */
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id);
			};

		}
	}

})();
