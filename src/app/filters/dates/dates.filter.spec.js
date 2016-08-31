(function() {
	'use strict';

	describe('TU > formaterDate >', function() {

		// chargement de l'appli
		beforeEach(function() {
			module('greyjaysEvaluation');
		});

		it('filtre formaterDate', inject(function($filter) {
			expect($filter('formaterDate')).not.toBeNull();
		}));

		it('tests de formaterDate', inject(function(formaterDateFilter) {
			var maDate = new Date('07/02/1974 09:05:15');
			expect(formaterDateFilter(maDate, 'mois ANNEE')).toEqual('Juillet 1974');
			expect(formaterDateFilter(maDate, 'jour mois annee')).toEqual('2 juillet 1974');
			expect(formaterDateFilter(maDate, 'hh mm')).toEqual('9h05');
			expect(formaterDateFilter(maDate, 'libelle jour')).toEqual('Mardi 2');
			expect(formaterDateFilter(maDate, 'libelle jour mois')).toEqual('Mardi 2 juillet');
			expect(formaterDateFilter(maDate, 'mois')).toEqual('Juillet');
		}));

	});

})();
