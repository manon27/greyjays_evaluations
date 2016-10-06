(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("coachAccueil", coachAccueil);

	/**
	@name		coachAccueil
	@desc 		<coach-accueil></coach-accueil>
	@returns	GUI du footer
	*/

	/** @ngInject */
	function coachAccueil() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/components/coachAccueil/coachAccueil.tpl.html',
			link: linkF
		};
		return directive;

		function linkF() {
		}
	}

})();
