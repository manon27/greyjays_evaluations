(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("monFooter", monFooter);

	/**
	@name		monFooter
	@desc 		<mon-footer></mon-footer>
	@returns	GUI du footer
	*/

	/** @ngInject */
	function monFooter() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/components/monFooter/monFooter.tpl.html',
			link: linkF
		};
		return directive;

		function linkF(scope) {
			scope.aujourdhui = new Date();
		}
	}

})();
