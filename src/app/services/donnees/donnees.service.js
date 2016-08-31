(function() {

	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('DonneesService', DonneesService);

	/** @ngInject */
	function DonneesService(PositionService, _) {

		this.dataSets = {};

		this.updateDataSets = function() {

			var data = this.dataSets;

			// initialisation des ListData avec l ensemble des valeurs json
			data.positionListData = this.positionListData(PositionService.all);

		};

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
