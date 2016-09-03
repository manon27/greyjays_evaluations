(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.filter('php_crud_api_transform', php_crud_api_transform);

	/**
	@name 		php_crud_api_transform
	@desc 		filtre de transformation du json issu de l'API en json pour l'appli
	@param 		librairie underscore
	@returns	objet json
	*/

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

	/**
	--------------------------------------------------
	structure du json retourné par l'API
	--------------------------------------------------
		position
			columns ["id","libelle","description","date_creation","date_modification"]
			records [
				["1","Ma position 1","C'est la position 1s","2016-08-31 22:14:31","2016-08-31 22:14:31"]
				["2","Position 2","C'est la seconde position","2016-08-31 22:15:14","2016-08-31 22:15:14"]
				...
			]
	--------------------------------------------------
	structure du json utilisé par AngularJs
	--------------------------------------------------
		positions [
			{id:1,libelle:"Ma position 1", description:"C'est la position 1s", date_creation:"2016-08-31 22:14:31",}
			...
		]
	*/
})();
