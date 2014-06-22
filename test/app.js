angular.module('app', ['ui.sortable'])
.controller('AppCtrl', function($scope){
	$scope.tracks = [
			{artist: 'Jack Johnson', title: 'Brushfire Fairytales'},
			{artist: 'Jack Johnson', title: 'I Got You'},
			{artist: 'Ingrid Michelson', title: 'You and I'},
			{artist: 'Regina Spektor', title: 'Us'}
		];

	$scope.addItem = function()
	{

		$scope.tracks.push({
			artist:'rando',
			title:'song'
		});
	}
});