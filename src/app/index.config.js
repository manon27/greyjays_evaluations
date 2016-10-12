(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.config(config);

	/**
	 * Configuration du module principal
	 * @param {provider} $httpProvider - Provider http...
	 * @param {provider} $logProvider
	 * @param {string} APPLICATION_ENV - Environnement
	 * @param {provider} ChartJsProvider - Provider pour le module chart.js
	 */

	/** @ngInject */
	function config($httpProvider, $logProvider, APPLICATION_ENV, ChartJsProvider) {
		// Enable log
		$logProvider.debugEnabled(APPLICATION_ENV === 'local');

		// Configure all charts
		ChartJsProvider.setOptions({
			colors: ['#97BBCD', '#F7464A', '#46BFBD', '#DCDCDC', '#FDB45C', '#949FB1', '#4D5360']
		});
		
	}

})();
