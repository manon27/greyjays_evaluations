(function(__W) {
	'use strict';

	var APPLICATION_PARAMS = {
		production: {
			RESOURCE_URL: '/api/ws/'
		},
		local: {
			RESOURCE_URL: ''
		}
	};

	angular
		.module('greyjaysEvaluations')
		.constant('_', __W._)
		.constant('APPLICATION_PARAMS', APPLICATION_PARAMS)
		.constant('APPLICATION_ENV', __W.APPLICATION_ENV);

})(window);
