(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("coachJoueur", coachJoueur);

	/**
	 * GUI de gestion CRUD des joueurs
	 * @desc <coach-joueur items="" le-service="" filter-property=""></coach-joueur>
	 * @returns {directive}
	 */

	/** @ngInject */
	function coachJoueur($rootScope) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '=',
				filterProperty: '@'
			},
			templateUrl: 'app/components/coachJoueur/coachJoueur.tpl.html',
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
					liste: false,
					add : false,
					upd : true,
					view: false
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
			 * Effacer le joueur
			 * @param {Object} itemDel - joueur à supprimer
			 */
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id);
			};

		}
	}

})();
