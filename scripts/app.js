(function(){
	var app = angular.module('lifeCounter', []);
	app.controller('GameController', function(){
		
		var self = this;
		
		this.players = [];
		
		this.addPlayer = function(){
			self.players.push({
				'name': 'Player ' + (self.players.length +1), 
				'life': 40, 
				'poison':0
			});
		};
		
		this.updatePlayerLife = function(amount, player){
			player.life += amount;
		};
		
		this.updatePlayerPoison = function(amount, player){
			player.poison += amount;
		};
		
		this.restart = function(){
			self.players = [{
				'name': 'Player 1', 'life': 40, 'poison':0
			},{
				'name': 'Player 2', 'life': 40, 'poison':0
			}];
		};
		
		self.restart();
		
	});
	
	/*app.directive('player', function(){
		return {
			'restrict': 'E',
			'templateUrl: 'scripts/playerModule/player.html'
		};
	});*/
})();