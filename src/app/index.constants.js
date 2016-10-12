(function(__W) {
	'use strict';

	/**
	 * Parametres de l'application
	 */
	var APPLICATION_PARAMS = {
		production: {
			RESOURCE_URL: 'http://manoloexpo.free.fr/__experimentations/gj_evaluations/server/index.php/'
		},
		local: {
			RESOURCE_URL: 'http://localhost/__experimentations/gj_evaluations/server/index.php/'
		},
		json: {
			RESOURCE_URL: ''
		}
	};

	/**
	 * Rôles de l'application
	 */
	var AUTH_ROLES = {joueur: "joueur", evaluateur: "evaluateur", coach: "coach"};

	/**
	 * Chargement des constantes de l'application
	 */
	angular
		.module('greyjays.evaluations')
		.constant('_', __W._)
		.constant('APPLICATION_PARAMS', APPLICATION_PARAMS)
		.constant('APPLICATION_ENV', __W.APPLICATION_ENV)
		.constant('AUTH_ROLES', AUTH_ROLES)
		.constant('VERSION', "1.0.0");

})(window);
