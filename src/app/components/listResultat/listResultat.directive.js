(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("listResultat", listResultat);

	/**
	 * GUI d'affichage des résultats
	 * @desc <list-resultat items="" joueur-selected="" action-selected="" position-selected="" le-service=""></list-resultat>
	 * @param {service} ActionService/JoueurService/PerformanceService - Services pour les listes liées
	 * @returns	{directive}
	 */

	/** @ngInject */
	function listResultat(ActionService, JoueurService, PerformanceService) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				joueurSelected: '=',
				actionSelected: '=',
				positionSelected: '=',
				leService: '='
			},
			templateUrl: 'app/components/listResultat/listResultat.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.affichage={};
			scope.affichage.add=false;
			scope.items = scope.items || [];
			scope.alertesResultat=false;
			scope.maxSize = 5;
			scope.itemsPerPage = 20;
			scope.currentPage = 1;
			scope.count = 1000;
			scope.affMesurable=false;
			scope.allPerfs=[];

			/**
			 * Surveiller les modifications sur les items
			 * @param {Object[]} items - nouvelle valeur
			 */	
			scope.$watch('items', function(newList) {
				scope.count = newList.length;
			});
			
			/**
			 * Lister les items en fonction de la pagination 
			 * @returns {Object[]}
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
				if ((scope.joueurSelected.length==1) && (scope.actionSelected.length==1)) {
					scope.alertesResultat=false;
					scope.itemAdd = {
						date_realisation : new Date(),
						inmatch : 0,
						joueur : JoueurService.filtrerParId(scope.joueurSelected[0]),
						action : ActionService.filtrerParId(scope.actionSelected[0]),
						performance : ""
					};
					scope.affichage.add=true;
					if (scope.itemAdd.action.mesurable === 0) {
						scope.affMesurable=false;
						var aActs = [];
						aActs.push(scope.itemAdd.action.id);
						scope.allPerfs = PerformanceService.filtrerParActions(aActs);
					} else {
						scope.affMesurable=true;
					}
				}
			};

			/**
			 * Enregistrer
			 * @param {boolean} estValide
			 */
			scope.enregistrer = function(estValide) {
				scope.alertesResultat=true;
				if (estValide) {
					var itemAjout = {
						"id": scope.itemAdd.id,
						"id_action": scope.itemAdd.action.id,
						"id_joueur": scope.itemAdd.joueur.id,
						"performance": scope.itemAdd.performance,
						"inmatch": scope.itemAdd.inmatch,
						"date_realisation": new Date(scope.itemAdd.date_realisation)
					};
					scope.leService.save(itemAjout);
					scope.affichage.add=false;
				} else {
					return false;
				}
			};

			/**
			 * Annuler
			 */
			scope.annuler = function() {
				scope.affichage.add=false;
			};

		}
	}

})();
