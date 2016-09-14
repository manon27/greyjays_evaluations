(function(__W) {
	'use strict';

	var APPLICATION_PARAMS = {
		production: {
			RESOURCE_URL: 'http://localhost/gj_evaluations/api.php/'
		},
		local: {
			RESOURCE_URL: ''
		}
	};

	var AUTH_ROLES = {public: "public", user: "user", admin: "admin"};

	var AUTH_EVENTS = {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	};

	angular
		.module('greyjays.evaluations')
		.constant('_', __W._)
		.constant('APPLICATION_PARAMS', APPLICATION_PARAMS)
		.constant('APPLICATION_ENV', __W.APPLICATION_ENV)
		.constant('AUTH_ROLES', AUTH_ROLES)
		.constant('AUTH_EVENTS', AUTH_EVENTS);

})(window);
