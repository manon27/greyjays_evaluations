(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive('convertToNumber', convertToNumber);

	/** @ngInject */
	function convertToNumber() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				ngModel.$parsers.push(function(val) {
					return parseInt(val, 10);
				});
				ngModel.$formatters.push(function(val) {
					return '' + val;
				});
			}
		};
	}

})();
