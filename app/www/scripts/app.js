(function(){
	var app = angular.module('lifeCounter', []);
	app.controller('GameController', function(){
		
		var self = this;
		
		var record, updateRecordTimeout;
		
		this.players = [];
		this.atticAttr = null;
		
		this.addPlayer = function(){
			hapticFeedback();
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
		
		this.setActiveAttr = function($event, attr, player, general){
			hapticFeedback();
			if(updateRecordTimeout){
				clearTimeout(updateRecordTimeout);
				updateRecord();
			}
			var activeElem = document.getElementsByClassName('active')[0];
			if(activeElem){
				activeElem.className = activeElem.className.replace(' active', '');
			}
			$event.target.className += " active";
			self.activeAttr = {
				'attr': attr,
				'player': player,
				'general': general
			};
		};
		
		this.updateActiveAttr = function(amount){
			hapticFeedback();
			if(updateRecordTimeout) clearTimeout(updateRecordTimeout);
			if(!record){
				record = {
					'value': 0,
					'label': self.activeAttr.attr,
					'start': self.activeAttr.player.life,
				};
			}
			record['time'] = new Date().toLocaleString();
			if(self.activeAttr.attr === 'damage'){
				if(amount < 0 && Math.abs(amount) > self.activeAttr.general[self.activeAttr.attr]){
					amount = (amount/Math.abs(amount))*self.activeAttr.general[self.activeAttr.attr];
				}
				self.activeAttr.player.life -= amount;
				self.activeAttr.general[self.activeAttr.attr] += amount;
				record['value'] += amount;
				record['end'] = self.activeAttr.player.life;
			} else {
				self.activeAttr.player[self.activeAttr.attr] += amount;
				self.activeAttr.player.record.push(self.activeAttr.attr + ': ' + amount);
				
				if(self.activeAttr.attr !== 'life' && self.activeAttr.player[self.activeAttr.attr] < 0){
					self.activeAttr.player[self.activeAttr.attr] = 0;
				} 
				record['value'] += amount;
				record['end'] = self.activeAttr.player.life;
			}
			updateRecordTimeout = setTimeout(updateRecord, 1000);
			
		}
		
		this.setPlayerRenaming = function($event, player, val){
			player.renaming = val;
			if(val){
				setTimeout(function(){
					var input = $event.target.parentNode.getElementsByTagName('input')[0];
					input.focus(true);
					input.click();
				}, 0);
			}
			if(!player.name){
				player.name = 'Player';
			}
		};
		
		this.renamingPlayer = function(){
			var renaming = false;
			for(var i=0, len = self.players.length; i<len; i++){
				if(self.players[i].renaming){
					renaming = true;
					break;
				}
			}
			return renaming;
		};
		
		this.restart = function(){
			hapticFeedback();
			self.players = [];
			self.addPlayer();
			self.addPlayer();
		};
		
		function updateRecord(){
			self.activeAttr.player.record.push(record);
			record = null;
			updateRecordTimeout = null;
		}
		
		function hapticFeedback(){
			if(navigator && navigator.notification){navigator.notification.vibrate(70);}
		}
		
		self.players = [];
			self.addPlayer();
			self.addPlayer();
		
	});

})();