(function(){
	var app = angular.module('lifeCounter', []);
	app.controller('GameController', function(){
		
		var self = this;
		
		this.players = [];
		
		this.addPlayer = function(){
			var newPlayer = {
				'name': 'Player ' + (self.players.length +1), 
				'life': 40, 
				'poison':0,
				'generalDamage': []
			}
			for(var i=0, len = self.players.length; i<len; i++){
				newPlayer.generalDamage.push({
					'player': self.players[i],
					'damage': 0
				});
			}
			self.players.push(newPlayer);
			for(var i=0, len = self.players.length-1; i<len; i++){
				self.players[i].generalDamage.push({
					'player': newPlayer,
					'damage': 0
				});
			}
			
		};
		
		this.updatePlayerLife = function(amount, player){
			player.life += amount;
		};
		
		this.updatePlayerPoison = function(amount, player){
			player.poison += amount;
		};
		
		this.setPlayerRenaming = function($event, player, val){
			player.renaming = val;
			if(val){
				setTimeout(function(){$event.target.parentNode.getElementsByTagName('input')[0].select();}, 0);
			}
			if(!player.name){
				player.name = 'Player';
			}
		};
		
		this.restart = function(){
			self.players = [];
			self.addPlayer();
			self.addPlayer();
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