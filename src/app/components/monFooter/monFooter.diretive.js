(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("monFooter", monFooter);

	/**
	 * GUI du footer
	 * @desc <mon-footer></mon-footer>
	 * @returns	{directive}
	 */

	/** @ngInject */
	function monFooter(VERSION) {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/components/monFooter/monFooter.tpl.html',
			link: linkF
		};
		return directive;

		function linkF(scope) {
			scope.aujourdhui = new Date();
			scope.version = VERSION;
		}
	}

})();
