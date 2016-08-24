(function() {
	'use strict';

	angular
		.module('greyjaysEvaluations')
		.config(config);

	/** @ngInject */
	function config($logProvider, APPLICATION_ENV) {
		// Enable log
		$logProvider.debugEnabled(APPLICATION_ENV === 'local');
	}

})();
