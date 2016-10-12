(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudJoueur", crudJoueur);

	/**
	 * GUI de gestion CRUD des joueurs
	 * @desc <crud-joueur items="" le-service=""></crud-joueur>
	 * @returns {directive}
	 */

	/** @ngInject */
	function crudJoueur() {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '='
			},
			templateUrl: 'app/components/crudJoueur/crudJoueur.tpl.html',
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
			scope.joueurDetail=false;

			/**
			 * Surveiller les modifications sur les items
			 * @param {Object[]} items - nouvelle valeur
			 */	
			scope.$watch('items', function(newList){
				scope.count = newList.length;
			});

			/**
			 * lister les items en fonction de la pagination
			 */
			scope.pageItems = function() {
				var start = (scope.currentPage - 1) * parseInt(scope.itemsPerPage, 10);
				var limit = parseInt(scope.itemsPerPage, 10);
				var lesItems = scope.items.slice(start, start + limit);
				return lesItems;
			};

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
			 * Obtenir l'url d'affichage detail du joueur
			 * @param {Object} it - joueur
			 * @returns {string}
			 */
			scope.getUrlJoueur = function(it) {
				return '#/joueur/' + it.id;
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
