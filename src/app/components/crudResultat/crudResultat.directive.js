(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudResultat", crudResultat);

	/**
	@name		crudResultat
	@desc 		<crud-resultat items="" le-service=""></crud-resultat>
	@param		Services pour les listes liées
	@returns	GUI de gestion CRUD des positions
	*/

	/** @ngInject */
	function crudResultat(ActionService, JoueurService, PerformanceService, _) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '='
			},
			templateUrl: 'app/components/crudResultat/crudResultat.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.affichage={};
			scope.affichage.add=false;
			scope.affichage.upd=false;
			scope.affichage.liste=true;
			scope.items = scope.items || [];
			scope.itemAdd = {};
			scope.allActions = ActionService.all;
			scope.allJoueurs = JoueurService.all;
				
			scope.actionSel = "-1";
			scope.joueurSel = "-1";
				
			scope.$watch('actionSel', function(newPos){
				filtrer(newPos,scope.joueurSel);
			});

			scope.$watch('joueurSel', function(newPos){
				filtrer(scope.actionSel,newPos);
			});

			scope.$watch('items', function(newVal) {
				_.each(newVal, function(val) {
					var laNote = PerformanceService.getNote(val.id_action, val.performance);
					var aStars = [];
					if (laNote != '???') {
						for (var i=0; i<parseInt(laNote,10) ; i++) {
							aStars.push(""+i);
						}
					}
					val.maNote = aStars;
				});

			});

			var filtrer = function(actionS, joueurS) {
				if (joueurS == "-1") {
					if (actionS == "-1") {
						scope.itemsF = scope.items;
					} else {
						scope.itemsF = _.filter(scope.items, function(item) {
							return item.action.id == actionS;
						});
					}
				} else {
					scope.itemsF = _.filter(scope.items, function(item) {
						return item.joueur.id == joueurS;
					});
					if (actionS != "-1") {
						scope.itemsF = _.filter(scope.itemsF, function(item) {
							return item.action.id == actionS;
						});
					}
				}

			};

			/**
			@name	afficherAjout
			@desc 	affichage de la GUI d'ajout avec init du param
			*/
			scope.afficherAjout = function() {
				scope.itemAdd = {};
				scope.itemAdd.date_realisation = new Date();				
				scope.affichage.add=true;
				scope.affichage.upd=false;
			};

			/**
			@name		afficherModification
			@desc 		affichage de la GUI de modif
			@param	 	it : item de position
			*/
			scope.afficherModification = function(it) {
				scope.itemAdd = {};
				for (var noeud in it) {
					if (angular.isString(it[noeud])) {
						scope.itemAdd[noeud] = it[noeud];
					}
				}
				scope.itemAdd.date_realisation = new Date(scope.itemAdd.date_realisation);
				scope.affichage.add=false;
				scope.affichage.upd=true;
			};

			/**
			@name		enregistrer
			@desc 		appel du service save + refresh via la root
			*/
			scope.enregistrer = function() {
				var itemAjout = {};
				itemAjout = scope.itemAdd;
				if (typeof scope.itemAdd.id !== 'undefined') {
					itemAjout.id=scope.itemAdd.id;
				}
				scope.leService.save(itemAjout);
				scope.affichage.add=false;
				scope.affichage.upd=false;
				
			};

			/**
			@name 	annuler
			@desc 	Masquer les interfaces add et upd
			*/
			scope.annuler = function() {
				scope.affichage.add=false;
				scope.affichage.upd=false;
			};

			/**
			@name 	effacer
			@desc 	Appel du service (service.delete)
			*/
			scope.effacer = function(itemDel) {
				scope.leService.delete(itemDel.id);
			};

		}
	}

})();
