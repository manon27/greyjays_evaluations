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

	angular
		.module('greyjays.evaluations')
		.constant('_', __W._)
		.constant('APPLICATION_PARAMS', APPLICATION_PARAMS)
		.constant('APPLICATION_ENV', __W.APPLICATION_ENV)
		.constant('AUTH_ROLES', AUTH_ROLES);

})(window);
