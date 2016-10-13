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
	function detailJoueur($filter, PositionService, _) {
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


			/**
			 * Surveiller les modifications sur le joueur (qui)
			 * @param {Object} qui - nouvelle valeur
			 */	
			scope.$watch('qui', function(newJoueur) {

				construireRadar(newJoueur);

				construireLine(newJoueur);

			});

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
					allColors : ['#D0262E', '#3F2992', '#D4B427'],
					allSeries : ['Max du joueur', 'Moyenne du joueur', 'Moyenne équipe'],
					allDSOverride : [
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
					_.each(maPos.actions, function(monAct) {
						labels.push(monAct.libelle);
						//	sur le joueur en cours...
						var res = [];
						if (typeof objJoueur.resultats !== 'undefined') {
							res = _.filter(objJoueur.resultats, function(result) {
								return result.id_action === monAct.id;
							});
						}
						var max = 0;
						var moy = 0;
						if (res.length > 0) {
							max = _.max(res, function(item) {
								return item.maNote.length;
							}).maNote.length;
							_.each(res, function(item) {
								moy += item.maNote.length;
							});
							moy = Math.round(moy / res.length * 100) / 100;
						}
						donneesMax.push(max);
						donneesMoy.push(moy);
						// sur l equipe
						var totEquipe = 0;
						var moyEquipe = 0;
						if ((typeof monAct.resultats !== 'undefined') && (monAct.resultats.length > 0)) {
							_.each(monAct.resultats, function(res0) {
								totEquipe += res0.maNote.length;
							});
							moyEquipe = Math.round(totEquipe / monAct.resultats.length * 100) / 100;
						}
						donneesMoyEquipe.push(moyEquipe);
					});
					unGraph.mesLabels = labels;
					donnees.push(donneesMax);
					donnees.push(donneesMoy);
					donnees.push(donneesMoyEquipe);
					unGraph.mesDonnees = donnees;
					scope.mesradars.allGraphs.push(unGraph);
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
								return result.id_action === monAct.id;
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
								return result.id_action === monAct.id;
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

		}
	}

})();
