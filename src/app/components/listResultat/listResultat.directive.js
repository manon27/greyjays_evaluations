(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("listResultat", listResultat);

	/**
	@name		listResultat
	@desc 		<list-resultat items></list-resultat>
	@param		Services pour les listes liées
	@returns	GUI de gestion CRUD des positions
	*/

	/** @ngInject */
	function listResultat(ActionService, JoueurService, _) {
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

			/**
			@name		watcher
			@desc 		surveille les modifications sur les items
			@param		newList	nouvelle valeur
			@return 	void
			*/	
			scope.$watch('items', function(newList) {
				scope.count = newList.length;
			});
			
			/**
			@name		pageItems
			@desc 		liste des items en fonction de la pagination
			@return 	lesItems à afficher
			*/	
			scope.pageItems = function() {
				var start = (scope.currentPage - 1) * parseInt(scope.itemsPerPage, 10);
				var limit = parseInt(scope.itemsPerPage, 10);
				var lesItems = scope.items.slice(start, start + limit);
				return lesItems;
			};

			/**
			@name	afficherAjout
			@desc 	affichage de la GUI d'ajout avec init du param
			*/
			scope.afficherAjout = function() {
				if ((scope.joueurSelected.length==1) && (scope.actionSelected.length==1)) {
					scope.alertesResultat=false;
					scope.itemAdd = {};
					scope.itemAdd.date_realisation = new Date();				
					scope.itemAdd.test = 0;	
					scope.itemAdd.joueur = JoueurService.filtrerParId(scope.joueurSelected[0]);		
					scope.itemAdd.action = ActionService.filtrerParId(scope.actionSelected[0]);		
					scope.affichage.add=true;
				}
			};

			/**
			@name		enregistrer
			@desc 		appel du service save + refresh via la root
			*/
			scope.enregistrer = function(estValide) {
				scope.alertesResultat=true;
				if (estValide) {
					var itemAjout = {};
					for (var noeud in scope.itemAdd) {
						if (angular.isString(scope.itemAdd[noeud])) {
							itemAjout[noeud] = scope.itemAdd[noeud];
						}
						if (angular.isNumber(scope.itemAdd[noeud])) {
							itemAjout[noeud] = scope.itemAdd[noeud];
						}
					}
					itemAjout.id_joueur = scope.itemAdd.joueur.id;
					itemAjout.id_action = scope.itemAdd.action.id;
					scope.leService.save(itemAjout);
					scope.affichage.add=false;
				} else {
					return false;
				}
			};

			/**
			@name 	annuler
			@desc 	Masquer les interfaces add et upd
			*/
			scope.annuler = function() {
				scope.affichage.add=false;
			};

		}
	}

})();
