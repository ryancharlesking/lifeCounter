(function(){
	var app = angular.module('lifeCounter', ['ionic', 'Factories']);
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
				'history': []
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
			controller: function($scope, DamageManager){
				$scope.setActiveAttribute = function($event){
					hapticFeedback();
					highlightElement($event.target);
					DamageManager.setScope($scope);
				};
				
				$scope.updateAttr = function(val){
					if(val < 0 && Math.abs(val) > $scope.general.damage){
						val = (val/Math.abs(val))*$scope.general.damage;
					}
					$scope.general.damage += val;
					$scope.$parent.player.life -= val;
					$scope.$parent.updateHistory($scope.general.player.name + ' general', $scope.$parent.player.life, $scope.$parent.player.life+val);
				};
			},
			templateUrl: 'general.html'
		}
	});
	
	app.directive('player', function(){
		return {
			restrict: 'E',
			controller: function($scope, DamageManager){
				var record = {};
				var recordTimeout = null;
				
				$scope.setActiveAttribute = function($event, attr){
					hapticFeedback();
					highlightElement($event.target);
					$scope.attr = attr;
					DamageManager.setScope($scope);
				};
				
				$scope.updateAttr = function(val){
					switch($scope.attr){
						case 'life':
							$scope.player.life += val;
							$scope.updateHistory('Life', $scope.player.life, $scope.player.life-val);
							break;
						case 'poison':
							$scope.player.poison += val;
							if($scope.player.poison < 0) $scope.player.poison = 0;
							$scope.updateHistory('Poison', $scope.player.poison, $scope.player.poison-val);
							break;
						default:
							break;
					}
				};
				
				$scope.setRenaming = function($event, val){
					var player = $scope.player;
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
				
				$scope.updateHistory = function(id, end, start){
					if(recordTimeout) clearTimeout(recordTimeout);
					if(record.id === id){
						record.end = end;
					} else {
						addRecord();
						record.id = id;
						record.start = start;
						record.end = end;
					}
					recordTimeout = setTimeout(addRecord, 3000);
				};
				
				function addRecord(){
					console.log(record.id + ': ' + record.start + ' > ' + record.end);
					if(!record.id || record.start === record.end) return;
					$scope.player.history.push(record);
					
				}
			},
			templateUrl: 'player.html'
		}
	});

	app.directive('counters', function(){
		return {
			restrict: 'E',
			transclude: true,
			controller: function($scope, DamageManager){
				$scope.update = function(val){
					hapticFeedback();
					DamageManager.updateAttr(val);
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