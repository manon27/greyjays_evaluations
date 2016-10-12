(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('LogoutController', LogoutController);

	/**
	 * Controlleur pour la page de logout
	 * @param {Object} $location
	 * @param {service} AuthService - Service pour l'authentification
	 */

	/** @ngInject */
	function LogoutController(AuthService) {

		AuthService.deconnecter();

	}

})();
