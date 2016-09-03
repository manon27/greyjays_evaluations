(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.filter('php_crud_api_transform', php_crud_api_transform);

	/** @ngInject */
	function php_crud_api_transform(_) {
		return function (input) {
			var newJson = {};
			var get_objects = function (tables,table_name) {
				var objects = [];
				_.each(tables[table_name].records, function(record) {
					var object = {};
					_.each(tables[table_name].columns, function(column) {
						object[column] = record[_.indexOf(tables[table_name].columns,column)];
					});
					objects.push(object);
				});
				
				return objects;
			};
			for (var entite in input) {
				newJson[entite+'s'] = get_objects(input,entite);
			}
			return newJson;
		};
	}
})();
