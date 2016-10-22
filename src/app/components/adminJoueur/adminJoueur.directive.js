(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("adminJoueur", adminJoueur);

	/**
	 * GUI de gestion CRUD des joueurs
	 * @desc <admin-joueur items="" le-service=""></admin-joueur>
	 * @returns {directive}
	 */

	/** @ngInject */
	function adminJoueur() {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '='
			},
			templateUrl: 'app/components/adminJoueur/adminJoueur.tpl.html',
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
				scope.alertesJoueur=false;
				scope.itemAdd = {};
				scope.affichage = {
					"add" : true,
					"upd" : false,
					"liste": false
				};
			};

			/**
			 * Afficher la GUI de modif
			 * @param {Object} it - le joueur à modifier
			 */
			scope.afficherModification = function(it) {
				scope.alertesJoueur=false;
				scope.itemAdd = {
					"id": it.id,
					"nom": it.nom,
					"prenom": it.prenom,
					"email": it.email,
					"date_naissance": new Date(it.date_naissance),
					"date_inscription": new Date(it.date_inscription),
					"poids": it.poids,
					"taille": it.taille,
					"role": it.role
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
				scope.alertesJoueur=true;
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
			 * Effacer le joueur
			 * @param {Object} itemDel - joueur à supprimer
			 */
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id);
			};

		}
	}

})();
