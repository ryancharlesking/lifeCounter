(function(){
	var app = angular.module('lifeCounter', []);
	app.controller('GameController', function(){
		
		var self = this;
		
		var initialPlayers = [{
			'name': 'Player 1', 'life': 40, 'poison':0
		},{
			'name': 'Player 2', 'life': 40, 'poison':0
		}];
		this.players = initialPlayers.concat();
		
		this.addPlayer = function(){
			self.players.push({
				'name': 'Player ' + (self.players.length +1), 
				'life': 40, 
				'poison':0
			});
		};
		
		this.restart = function(){
			self.players = initialPlayers.concat();
		};
		
	});
	
	/*app.directive('player', function(){
		return {
			'restrict': 'E',
			'templateUrl: 'scripts/playerModule/player.html'
		};
	});*/
})();