(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('LogoutController', LogoutController);

	/** @ngInject */
	function LogoutController($location, SessionService) {

		SessionService.destroy();
		$location.url('/login');

	}

})();
