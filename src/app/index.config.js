(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.config(config);

	/** @ngInject */
	function config($httpProvider, $logProvider, APPLICATION_ENV) {
		// Enable log
		$logProvider.debugEnabled(APPLICATION_ENV === 'local');
	}

})();
