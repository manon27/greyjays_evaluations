(function() {

	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('DonneesService', DonneesService);

	/**
	@name 		DonneesService
	@desc 		Service qui contient l'intégralité des données présentes dans l'interface
	@param 		Services + librairie underscore
	@returns 	
	*/

	/** @ngInject */
	function DonneesService(PositionService, _) {

		/* jeu de donnees : dataSets */
		this.dataSets = {};

		/**
		@name 	updateDataSets
		@desc 	fonction pour alimenter le jeu de données
		*/
		this.updateDataSets = function() {

			var data = this.dataSets;

			// initialisation des ListData avec l ensemble des valeurs json
			data.positionListData = this.positionListData(PositionService.all);

		};

		/**
		@name	positionListData
		@desc 	ajout la propriété type dans les objets
		*/
		this.positionListData = function(positions) {
			if (typeof positions === 'undefined') {
				return [];
			}
			_.each(positions, function(position) {
				position.type = 'position';
			});
			return positions;
		};

	}

})();
