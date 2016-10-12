(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("crudResultat", crudResultat);

	/**
	 * GUI de gestion CRUD des resultats
	 * @desc <crud-resultat items="" le-service="" all-actions="" all-joueurs=""></crud-resultat>
	 * @param Services pour les listes liées
	 * @returns	{directive}
	 */

	/** @ngInject */
	function crudResultat(ActionService, JoueurService, PerformanceService, _) {
		var directive = {
			restrict: 'E',
			scope: {
				items: '=',
				leService: '=',
				allActions: '=',
				allJoueurs: '='
			},
			templateUrl: 'app/components/crudResultat/crudResultat.tpl.html',
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
			scope.itemsF = [];
			scope.itemAdd = {};
			scope.actionSel = "-1";
			scope.joueurSel = "-1";				
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
				scope.itemsF = newList;
				scope.count = scope.itemsF.length;
				filtrer(scope.actionSel,scope.joueurSel);
			});

			/**
			 * Surveiller les modifications sur actionSel
			 * @param {string} actionSel - nouvelle valeur
			 */	
			scope.$watch('actionSel', function(newVal){
				filtrer(newVal,scope.joueurSel);
			});

			/**
			 * Surveiller les modifications sur joueurSel
			 * @param {string} joueurSel - nouvelle valeur
			 */	
			scope.$watch('joueurSel', function(newVal){
				filtrer(scope.actionSel,newVal);
			});

			/**
			 * Filtrer les items en fonction des params
			 * @param {string} actionS - action sélectionnée
			 * @param {string} joueurS - joueur sélectionné
			 */	
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
				scope.count = scope.itemsF.length;
			};

			/**
			 * Surveiller les modifications sur itemAdd.id_action
			 * et changer l'affichage de performance si mesurable ou pas
			 * @param {Number} itemAdd.id_action - nouvelle valeur
			 */	
			scope.$watch('itemAdd.id_action', function(newVal){
				scope.allPerfs = [];
				if (typeof scope.itemAdd.id === 'undefined') {
					scope.itemAdd.performance="";
				}
				if ((typeof newVal !== 'undefined')&&(newVal!=='')) {
					var monAction = ActionService.filtrerParId(newVal);
					if (monAction.mesurable === 0) {
						scope.affMesurable=false;
						var aActs = [];
						aActs.push(newVal);
						scope.allPerfs = PerformanceService.filtrerParActions(aActs);
					} else {
						scope.affMesurable=true;
					}
				}
				
			});

			/**
			 * Lister les items en fonction de la pagination
			 */	
			scope.pageItems = function() {
				var start = (scope.currentPage - 1) * parseInt(scope.itemsPerPage, 10);
				var limit = parseInt(scope.itemsPerPage, 10);
				var lesItems = scope.itemsF.slice(start, start + limit);
				return lesItems;
			};

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
				scope.allPerfs = [];
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
