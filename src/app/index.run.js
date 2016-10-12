(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.run(runBlock);

	/**
	 * 
	 */

	/** @ngInject */
	function runBlock($location, $rootScope, AuthService) {
		$rootScope.$on('$routeChangeStart', function (event, next) {
			if (typeof next.roles !== 'undefined') {
				var authorizedRoles = next.roles.authorizedRoles;
				if (!AuthService.isAuthorized(authorizedRoles)) {
					$location.path('/logout');
				}
			}
		});
	}

})();
