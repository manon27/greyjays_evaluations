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
	function detailJoueur(PositionService, _) {
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

			scope.allLabels = [];
			scope.allTitres = [];
			scope.allDonnees = [];
			scope.allOptions = {
				legend: {
					display: true
				},
				scale: {
					ticks: {beginAtZero: true, min: 0, max: 5}
				}
			};
			scope.allColors = ['#FF0000','#0063AC','#7AB51D'];
			scope.allSeries = ['Max du joueur', 'Moyenne du joueur', 'Moyenne équipe'];
			scope.allDSOverride = [
				{
					backgroundColor: "rgba(0,0,0,0)"
				},
				{
					backgroundColor: "rgba(0,0,0,0)"
				},
				{
					backgroundColor: "rgba(0,0,0,0)"
				}
			];

			/**
			 * Surveiller les modifications sur le joueur (qui)
			 * @param {Object} qui - nouvelle valeur
			 */	
			scope.$watch('qui', function(newJoueur) {

				scope.allLabels = [];
				scope.allTitres = [];
				scope.allDonnees = [];

				// radars en fonction des positions...
				var allPos = PositionService.all;
				
				_.each(allPos, function(maPos) {
					scope.allTitres.push(maPos.libelle + ' : ' + maPos.description);
					var labels = [];
					var donnees = [];
					var donneesMax = [];
					var donneesMoy = [];
					var donneesMoyEquipe = [];
					_.each(maPos.actions, function(monAct) {
						labels.push(monAct.libelle);
						//	sur le joueur en cours...
						var res = _.filter(newJoueur.resultats, function(result) {
							return result.id_action === monAct.id;
						});
						var max = 0;
						var moy = 0;
						if (res.length > 0) {
							max = _.max(res, function(item) {
								return item.maNote.length;
							}).maNote.length;
							_.each(res, function(item) {
								moy += item.maNote.length;
							});
							moy = moy / res.length;
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
							moyEquipe = totEquipe / monAct.resultats.length;
						}
						donneesMoyEquipe.push(moyEquipe);
					});
					scope.allLabels.push(labels);
					donnees.push(donneesMax);
					donnees.push(donneesMoy);
					donnees.push(donneesMoyEquipe);
					scope.allDonnees.push(donnees);
				});

			});

		}
	}

})();
