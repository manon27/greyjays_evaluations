(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.config(config);

	/** @ngInject */
	function config($httpProvider, $logProvider, APPLICATION_ENV, localStorageServiceProvider) {
		// Enable log
		$logProvider.debugEnabled(APPLICATION_ENV === 'local');
		localStorageServiceProvider
		.setPrefix('greyjays')
		/*.setStorageType('sessionStorage')*/;

		/*$httpProvider.interceptors.push(['$injector', function ($injector) {
			return $injector.get('AuthInterceptor');
		}]);*/

	}

})();
