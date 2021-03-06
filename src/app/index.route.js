(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.config(routeConfig);

	/**
	 * Configuration de l'aiguillage de l'application
	 * @param {provider} $routeProvider - Provider du module ngRoute pour l'aiguillage
	 * @param {Object} AUTH_ROLES - Rôles
	 */

	function routeConfig($routeProvider, AUTH_ROLES) {

		$routeProvider
		.when('/admin', {
			templateUrl: 'app/views/admin/admin.html',
			controller: 'AdminController',
			controllerAs: 'admin',
			roles: {authorizedRoles: [AUTH_ROLES.admin]}
		})
		.when('/coach', {
			templateUrl: 'app/views/coach/coach.html',
			controller: 'CoachController',
			controllerAs: 'coach',
			roles: {authorizedRoles: [AUTH_ROLES.coach, AUTH_ROLES.admin]}
		})
		.when('/evaluateur', {
			templateUrl: 'app/views/evaluateur/evaluateur.html',
			controller: 'EvaluateurController',
			controllerAs: 'evaluateur',
			roles: {authorizedRoles: [AUTH_ROLES.coach, AUTH_ROLES.evaluateur, AUTH_ROLES.admin]}
		})
		.when('/joueur/:id', {
			templateUrl: 'app/views/joueur/joueur.html',
			controller: 'JoueurController',
			controllerAs: 'joueurCtrl',
			roles: {authorizedRoles: [AUTH_ROLES.coach, AUTH_ROLES.evaluateur, AUTH_ROLES.joueur, AUTH_ROLES.admin]}
		})
		.when('/login', {
			templateUrl: 'app/views/login/login.html',
			controller: 'LoginController',
			controllerAs: 'login'
		})
		.when('/logout', {
			templateUrl: 'app/views/logout/logout.html',
			controller: 'LogoutController',
			controllerAs: 'logout'
		})
		.when('/', {
			templateUrl: 'app/views/accueil/accueil.html',
			controller: 'AccueilController',
			controllerAs: 'accueil'
		})
		.otherwise({
			redirectTo: '/'
		});
	}

})();
