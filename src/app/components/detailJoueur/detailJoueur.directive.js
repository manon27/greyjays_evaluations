(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("detailJoueur", detailJoueur);

	/**
	 * GUI d'affichage du détail d'un joueur
	 * @desc <detail-joueur qui=""></detail-joueur>
	 * @param {service} PositionService - 
	 * @param {module} _
	 */

	/** @ngInject */
	function detailJoueur($filter, JoueurService, PositionService, _) {
		var directive = {
			restrict: 'E',
			scope: {
				qui: '='
			},
			templateUrl: 'app/components/detailJoueur/detailJoueur.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.leJoueur = 0;
			scope.affichage = 'moyenne';
			scope.dateDebutSaison=0;

			/**
			 * Surveiller les modifications sur le joueur (qui)
			 * @param {Object} qui - nouvelle valeur
			 */	
			scope.$watch('qui', function(newJoueur) {
				if (newJoueur.length === 1) {
						scope.leJoueur = JoueurService.filtrerParId(newJoueur[0].id);
						scope.afficher('moyenne');
				} else {
					scope.leJoueur = 0;
				}

			});

			scope.afficher = function(what) {
				scope.affichage = what;
				if (what === 'moyenne') {
					construireRadar(scope.leJoueur);
				}
				if (what === 'moyenne') {
					construireLine(scope.leJoueur);
				}
			};

			var construireRadar = function(objJoueur) {

				scope.mesradars = {
					allOptions : {
						legend: {
							display: true
						},
						scale: {
							ticks: {beginAtZero: true, min: 0, max: 5, stepSize: 1}
						}
					},
					allColors : ['#D0262E', '#3F2992', '#D4B427', '#289191'],
					allSeries : ['Max du joueur', 'Moyenne du joueur', 'Moyenne équipe', 'Dernière évaluation'],
					allDSOverride : [
						{
							backgroundColor: "rgba(0,0,0,0.1)"
						},
						{
							backgroundColor: "rgba(0,0,0,0.1)"
						},
						{
							backgroundColor: "rgba(0,0,0,0.1)"
						},
						{
							backgroundColor: "rgba(0,0,0,0.1)"
						}
					],
					allGraphs : []
				};

				// radars en fonction des positions...
				var allPos = PositionService.all;
				
				_.each(allPos, function(maPos) {
					var unGraph = {
						ind: 'radar'+maPos.id,
						monTitre : maPos.libelle + ' : ' + maPos.description,
						mesLabels: [],
						mesDonnees: []
					};

					var labels = [];
					var donnees = [];
					var donneesMax = [];
					var donneesMoy = [];
					var donneesMoyEquipe = [];
					var donneesLast = [];
					_.each(maPos.actions, function(monAct) {
						labels.push(monAct.libelle);
						//	sur le joueur en cours...
						var res = [];
						if (typeof objJoueur.resultats !== 'undefined') {
							res = _.filter(objJoueur.resultats, function(result) {
								if (result.id_action === monAct.id) {
									return checkSaison(result.date_realisation);
								}
							});
						}
						var max = 0;
						var moy = 0;
						var last = 0;
						if (res.length > 0) {
							max = _.max(res, function(item) {
								return item.maNote.length;
							}).maNote.length;
							_.each(res, function(item) {
								moy += item.maNote.length;
							});
							moy = Math.round(moy / res.length * 100) / 100;
							last = _.sortBy(res, 'date_realisation').reverse();
							last = last[0].maNote.length;
						}
						donneesMax.push(max);
						donneesMoy.push(moy);
						donneesLast.push(last);
					
						// sur l equipe
						var totEquipe = 0;
						var moyEquipe = 0;
						var compteurEquipe = 0;
						if ((typeof monAct.resultats !== 'undefined') && (monAct.resultats.length > 0)) {
							_.each(monAct.resultats, function(res0) {
								if (checkSaison(res0.date_realisation)) {
									totEquipe += res0.maNote.length;
									compteurEquipe++;
								}
							});
							moyEquipe = Math.round(totEquipe / compteurEquipe * 100) / 100;
						}
						donneesMoyEquipe.push(moyEquipe);
					});
					unGraph.mesLabels = labels;
					donnees.push(donneesMax);
					donnees.push(donneesMoy);
					donnees.push(donneesMoyEquipe);
					donnees.push(donneesLast);
					unGraph.mesDonnees = donnees;
					if (donnees[3].length > 0) {
						scope.mesradars.allGraphs.push(unGraph);
					}
				});

			};

			var construireLine = function(objJoueur) {

				scope.mesLines = {
					allOptions : {
						legend: {
							display: true
						},
						scales: {
							xAxes: [{
								display: false
							}],
							yAxes: [{
								ticks: {
									max: 5,
									min: 0,
									stepSize: 1
								}
							}]
						}
					},
					allColors : ['#D4B427', '#3F2992', '#D0262E', '#2DAD20', '#333333'],
					allDSOverride : [
						{
							backgroundColor: "rgba(0,0,0,0)",
							spanGaps: true,
							lineTension: 0
						},
						{
							backgroundColor: "rgba(0,0,0,0)",
							spanGaps: true,
							lineTension: 0
						},
						{
							backgroundColor: "rgba(0,0,0,0)",
							spanGaps: true,
							lineTension: 0
						},
						{
							backgroundColor: "rgba(0,0,0,0)",
							spanGaps: true,
							lineTension: 0
						},
						{
							backgroundColor: "rgba(0,0,0,0)",
							spanGaps: true,
							lineTension: 0
						}
					],
					allGraphs : []
				};

				// radars en fonction des positions...
				var allPos = PositionService.all;
				
				_.each(allPos, function(maPos) {
					var unGraph = {
						ind: 'line'+maPos.id,
						monTitre : maPos.libelle + ' : ' + maPos.description,
						mesSeries : [],
						mesLabels : [],
						mesDonnees : []
					};

					var series = [];
					var labels = [];

					_.each(maPos.actions, function(monAct) {
						series.push(monAct.libelle);

						//	sur le joueur en cours...
						var res = [];
						if (typeof objJoueur.resultats !== 'undefined') {
							res = _.filter(objJoueur.resultats, function(result) {
								if (result.id_action === monAct.id) {
									return checkSaison(result.date_realisation);
								}
							});
						}
						if (res.length > 0) {
							res = _.sortBy(res,'date_realisation');
							_.each(res, function(point) {
								labels.push(new Date(point.date_realisation).getTime());
							});
						}
					});
					labels = labels.sort();

					var donnees = [];
					_.each(maPos.actions, function(monAct) {
						var donneesAct = [];
						//	sur le joueur en cours...
						var res = [];
						if (typeof objJoueur.resultats !== 'undefined') {
							res = _.filter(objJoueur.resultats, function(result) {
								if (result.id_action === monAct.id) {
									return checkSaison(result.date_realisation);
								}
							});
						}
						if (res.length > 0) {
							res = _.sortBy(res,'date_realisation');
							_.each(res, function(point) {
								for (var i=0; i<labels.length; i++) {
									if (labels[i] == new Date(point.date_realisation).getTime()) {
										donneesAct[i] = point.maNote.length;
									}
								}
								labels.push();
							});
						}
						for (var i=0; i<labels.length; i++) {
							if (!donneesAct[i]) {
								donneesAct[i]=null;
							}
						}
						donnees.push(donneesAct);
					});

					for (var i=0; i<labels.length; i++) {
						var tt = new Date(labels[i]);
						labels[i] = $filter('formaterDate')(tt,'JJ/MM/AAAA à HHhMM');
					}
					
					unGraph.mesSeries = series;
					unGraph.mesLabels = labels;
					unGraph.mesDonnees = donnees;
					scope.mesLines.allGraphs.push(unGraph);
				});

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
