(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("detailClub", detailClub);

	/**
	 * GUI d'affichage des statistiques du club
	 * @desc <detail-club mes-donnees=""></detail-club>
	 * @param {service} JoueurService - 
	 * @param {service} PositionService - 
	 * @param {module} _
	 */

	/** @ngInject */
	function detailClub(JoueurService, PositionService, _) {
		var directive = {
			restrict: 'E',
			scope: {
				mesDonnees: '='
			},
			templateUrl: 'app/components/detailClub/detailClub.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.mesDonnees = scope.mesDonnees || {};
			scope.titre = 'Pas de graphe si pas de position sélectionnée...';
			scope.loading=false;
			scope.dateDebutSaison=0;

			scope.filterData = {
				actionIds: [],
				joueurIds: [],
				positionIds: []
			};

			scope.$on('filtrerDatas', function() {
				scope.loading=true;
				if (scope.filterData.positionIds.length > 0){
					construireRadar(scope.filterData);
				} else {
					detruireRadar();
				}
				scope.loading=false;
			});

			var detruireRadar = function() {
				scope.titre = 'Pas de graphe si pas de position sélectionnée...';
				scope.leRadar = {};
			};

			var construireRadar = function(filtreToApply) {

				// radars en fonction de la position
				var laPosition = PositionService.filtrerParId(filtreToApply.positionIds[0]);

				scope.titre = laPosition.libelle + '-' + laPosition.description;

				scope.leRadar = {
					mesOptions : {
						legend: {
							display: true
						},
						scale: {
							ticks: {beginAtZero: true, min: 0, max: 5, stepSize: 1}
						}
					},
					mesColors : ['#D4B427', '#3F2992', '#D0262E', '#2DAD20', '#333333'],
					mesSeries : [],
					mesLabels : [],
					mesDSOverride : [],
					mesDonnees : []
				};

				// Labels = actions de la position
				_.each(laPosition.actions, function(monAct) {
					scope.leRadar.mesLabels.push(monAct.libelle);
				});

				// Les séries = moyenne équipe + n x (moyenne joueur)
				// Moyenne de l'équipe
				scope.leRadar.mesSeries.push('Equipe');
				// Par joueur du filtre
				var joueurs = [];
				if (filtreToApply.joueurIds.length > 0) {
					_.each(filtreToApply.joueurIds, function(idJoueur) {
						var leJoueur = JoueurService.filtrerParId(idJoueur);
						scope.leRadar.mesSeries.push(leJoueur.prenom + ' ' + leJoueur.nom);
						joueurs.push(leJoueur.id);
					});
				}

				// Les données...
				// [
				// 		[ pour equipe
				//			[ par action , ...]
				//		]
				//		[ par joueur
				//			[ par action , ...]
				//		]
				// ]
				// pour equipe
				var donneesEquipe = [];
				_.each(laPosition.actions, function(monAct) {
					var moyenne = 0;
					if ((typeof monAct.resultats !== 'undefined') && (monAct.resultats.length > 0)) {
						var total = 0;
						var compteur = 0;
						_.each(monAct.resultats, function(monRes) {
							if (checkSaison(monRes.date_realisation)) {
								total += monRes.maNote.length;
								compteur++;
							}
						});
						moyenne = Math.round(total/compteur*100)/100;
					}
					donneesEquipe.push(moyenne);					
				});
				scope.leRadar.mesDonnees.push(donneesEquipe);
				scope.leRadar.mesDSOverride.push({
					backgroundColor: "rgba(0,0,0,0.1)"
				});
				// pour chaque joueur
				if (joueurs.length > 0) {
					_.each(joueurs, function(joueur) {
						var donneesJoueur = [];
						_.each(laPosition.actions, function(monAct) {
							var moyenne = 0;
							if ((typeof monAct.resultats !== 'undefined') && (monAct.resultats.length > 0)) {
								var total = 0;
								var compteur = 0;
								_.each(monAct.resultats, function(monRes) {
									if (monRes.id_joueur === joueur) {
										if (checkSaison(monRes.date_realisation)) {
											total += monRes.maNote.length;
											compteur++;
										}
									}
								});
								if (compteur>0) {
									moyenne = Math.round(total/compteur*100)/100;
								}
							}
							donneesJoueur.push(moyenne);					
						});
						scope.leRadar.mesDonnees.push(donneesJoueur);
						scope.leRadar.mesDSOverride.push({
							backgroundColor: "rgba(0,0,0,0.1)"
						});
					});
				}
			};

			var checkSaison = function(uneDate) {
				if (scope.dateDebutSaison!==0) {
					var timeD = scope.dateDebutSaison;
					var timeR = new Date(uneDate).getTime();
					var timeF = timeD + 365*24*60*60*1000;
					if (timeR<timeD || timeR>timeF) {
						return false;
					}
				}
				return true;
			};

		}
	}
})();
