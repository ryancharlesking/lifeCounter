﻿(function(){
	var app = angular.module('lifeCounter', []);
	app.controller('GameController', function(){
		
		var self = this;
		
		this.players = [];
		
		this.addPlayer = function(){
			var newPlayer = {
				'name': 'Player ' + (self.players.length +1), 
				'life': 40, 
				'poison':0,
				'generalDamage': [],
				'record': []
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
		
		this.setActiveAttr = function($event, attr, player){
			var activeElem = document.getElementsByClassName('active')[0];
			if(activeElem){
				activeElem.className = activeElem.className.replace(' active', '');
			}
			$event.target.className += " active";
			self.activeAttr = {
				'attr': attr,
				'player': player
			};
		};
		
		this.updateActiveAttr = function(amount){
			if(self.activeAttr){
				self.activeAttr.player[self.activeAttr.attr] += amount;
				self.activeAttr.player.record.push(self.activeAttr.attr + ': ' + amount);
			}
			if(self.activeAttr.attr !== 'life' && self.activeAttr.player[self.activeAttr.attr] < 0){
				self.activeAttr.player[self.activeAttr.attr] = 0;
			}
		}
		
		this.setPlayerRenaming = function($event, player, val){
			player.renaming = val;
			if(val){
				setTimeout(function(){$event.target.parentNode.getElementsByTagName('input')[0].focus(true);}, 0);
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

})();