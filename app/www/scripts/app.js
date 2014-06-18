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
		
		this.setPlayerRenaming = function($event, player, val){
			if(player.renaming === val) return;
			player.renaming = val;
			var input = $event.target.parentNode.getElementsByTagName('input')[0];
			if(val){
				setTimeout(function(){
					input.select();
				}, 0);
			} else if(document.activeElement === input){
				setTimeout(function(){				
					input.blur();
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
				
		self.players = [];
		self.addPlayer();
		self.addPlayer();
		
	});
	
		
	app.directive('general', function(){
		return {
			restrict: 'E',
			controller: function($scope, Messenger){
				$scope.setActiveAttribute = function($event){
					hapticFeedback();
					highlightElement($event.target);
					Messenger.ignore('updateAttr');
					Messenger.listen('updateAttr', updateAttr);
				};
				
				function updateAttr(val){
					if(val < 0 && Math.abs(val) > $scope.general.damage){
						val = (val/Math.abs(val))*$scope.general.damage;
					}
					$scope.general.damage += val;
					$scope.$parent.player.life -= val;
					$scope.$parent.updateHistory();
				};
			},
			templateUrl: 'general.html'
		}
	});
	
	app.factory('Messenger', function(){
		var messages = {};
		return {
			'listen': function(msg, func){
				if(messages.hasOwnProperty(msg)){
					messages[msg].push(func);
				} else {
					messages[msg] = [func];
				}
			},
			'notify': function(msg, val){
				if(messages.hasOwnProperty(msg)){
					angular.forEach(messages[msg], function(func, index){
						if(angular.isFunction(func)) func(val);
					});
				}
			},
			'ignore': function(msg, func){
				if(!messages.hasOwnProperty(msg)) return;
				if(func){
					angular.forEach(messages[msg].concat(), function(msgFunc, index){
						if(msgFunc === func){
							messages.splice(index);
						}
					});
				} else {
					messages[msg] = [];
				}
			}
		}
	});
	
	app.directive('player', function(){
		return {
			restrict: 'E',
			controller: function($scope, Messenger){
				$scope.setActiveAttribute = function($event, attr){
					hapticFeedback();
					highlightElement($event.target);
					$scope.attr = attr;
					Messenger.ignore('updateAttr');
					Messenger.listen('updateAttr', updateAttr);
				};
				
				function updateAttr(val){
					switch($scope.attr){
						case 'life':
							$scope.player.life += val;
							$scope.updateHistory();
							break;
						case 'poison':
							$scope.player.poison += val;
							if($scope.player.poison < 0) $scope.player.poison = 0;
							$scope.updateHistory();
							break;
						default:
							break;
					}
				};
				
				$scope.updateHistory = function(){
				
				}
			},
			templateUrl: 'player.html'
		}
	});

	app.directive('counters', function(){
		return {
			restrict: 'E',
			transclude: true,
			controller: function($scope, Messenger){
				$scope.update = function(val){
					hapticFeedback();
					Messenger.notify('updateAttr', val);
				}
			},
			templateUrl: 'counters.html'
		}
	});
	
	function highlightElement(elem){
		var activeElem = document.getElementsByClassName('active')[0];
		if(activeElem){
			activeElem.className = activeElem.className.replace(' active', '');
		}
		elem.className += " active";
	}
	
	function hapticFeedback(){
		if(navigator && navigator.notification){navigator.notification.vibrate(70);}
	}

})();