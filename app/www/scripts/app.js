(function(){
	var app = angular.module('lifeCounter', ['ionic', 'Factories']);
	
	
	
	app.controller('NavController', function($state,$ionicSideMenuDelegate, $timeout){
		this.navList = [
			{
				'title': 'Game',
				'href': '#/',
				'state': 'game',
                'icon': 'ion-home'
			},{
				'title': 'Profiles',
				'href': '#/profiles',
				'state': 'profiles',
                'icon': 'ion-filing'
			},{
				'title': 'Preferences',
				'href': '#/preferences',
				'state': 'preferences',
                'icon': 'ion-gear-b'
			}
		];
		
		this.go = function(state){
			hapticFeedback();
            $ionicSideMenuDelegate.toggleLeft();
            $state.go(state);
		};
	});
	
	app.config(function($stateProvider){
		$stateProvider
		.state('home', {
			url: '',
			templateUrl: 'game.html'
		})
		.state('game', {
			url: '/',
			templateUrl: 'game.html'
		})
		.state('profiles', {
			url: '/profiles',
			templateUrl: 'profile.html'
		})
		.state('preferences', {
			url: '/preferences',
			templateUrl: 'preferences.html'
		})
        .state('newProfile', {
			url: '/preferences/new-profile',
			templateUrl: 'new-profile.html'
		});;
	});
	
	app.controller('GameController', function($scope, $ionicModal, $ionicActionSheet, Preferences){
		var self = this;
		
		var record, updateRecordTimeout;
		
		this.players = [];
		this.atticAttr = null;
		this.formats = [
			{
                'name': 'Default Standard',
                'startingLife': 20,
                'smallIncrement': 1,
                'largeIncrement': 5,
                'players':[
                    {
                        'name' : 'Player 1'
                    },{
                        'name' : 'Player 2'
                    }
                ],
                'poison': true,
                'commanderDamage': false,
                'commanderCost': false
            },{
                'name': 'Default Commander',
                'startingLife': 40,
                'smallIncrement': 1,
                'largeIncrement': 5,
                'players':[
                    {
                        'name' : 'Player 1'
                    },{
                        'name' : 'Player 2'
                    }
                ],
                'poison': true,
                'commanderDamage': true,
                'commanderCost': true
            }
		];
		
		$ionicModal.fromTemplateUrl('profileModal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.profileModal = modal;
			$scope.loadProfile = function(profile){
				self.loadProfile(profile);
				$scope.profileModal.hide();
			};
		});
        		
		this.addPlayer = function(name){
			hapticFeedback();
            name = name || 'Player ' + self.players.length;
			var newPlayer = {
				'name': name, 
				'life': self.profile.startingLife, 
				'poison':0,
                'commanderCost': 0,
				'generalDamage': [],
				'history': []
			}
			self.players.push(newPlayer);
			if(self.profile.commanderDamage){
				for(var i=0, len = self.players.length; i<len; i++){
                    newPlayer.generalDamage.push({
						'player': self.players[i],
						'damage': 0
					});
                    if(self.players[i] !== newPlayer){
                        self.players[i].generalDamage.push({
                            'player': newPlayer,
                            'damage': 0
                        });
                    }
				}
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
            var buttons = [
                { 
                    text: 'New game',
                    id: 'new'
                },
                { 
                    text: 'Switch profile',
                    id: 'profile'
                }
            ];
            
            if(!self.profile){
                buttons = [
                    { 
                        text: 'Choose profile',
                        id: 'profile'
                    }
                ];
            }
            
            $ionicActionSheet.show({
                buttons: buttons,
                cancelText: 'Cancel',
                buttonClicked: function(index, button) {
                    if(button.id === 'new'){
                        self.loadProfile(self.profile);
                    } else if(button.id === 'profile'){
                        $scope.profileModal.show();
                    }
                    return true;
                }
            });
			
		};
                    
        this.getProfiles = function(){
            return Preferences.getProfiles().concat(self.formats);
        };
		
		this.loadProfile = function(profile){
            Preferences.setProfile(profile.name);
			self.players = [];
            self.profile = profile;
			for(var i=0; i<profile.players.length; i++){
				self.addPlayer(profile.players[i].name);
			}
		};
				
        var defaultProfile = Preferences.getProfile();
        if(defaultProfile){
            angular.forEach(self.getProfiles(), function(profile){
                if(profile.name === defaultProfile) self.loadProfile(profile);
            });
        }
		
		
	});
    
    app.controller('ProfileForm', function($scope, Preferences, $state){
        $scope.profile = {
            'name': 'New Profile',
            'startingLife': 20,
            'smallIncrement': 1,
            'largeIncrement': 5,
            'players':[
                {
                    'name' : 'Player 1'
                },{
                    'name' : 'Player 2'
                }
            ],
            'poison': true,
            'commanderDamage': false,
            'commanderCost': false
        };
        
        $scope.addPlayer = function(){
            $scope.profile.players.push({
                'name' : 'Player ' + ($scope.profile.players.length +1)
            });
        };
        
        $scope.deletePlayer = function($index){
            $scope.profile.players.splice($index,1);
        };
        
        $scope.save = function(){
            Preferences.addProfile(angular.copy($scope.profile));
            $state.go('profiles');
        };
        
        $scope.validateName = function(){
            var valid = true;
            var profiles = Preferences.getProfiles();
            for(var i=0, len=profiles.length; i<len;i++){
                if(profiles[i].name === $scope.profile.name){
                    valid = false;
                    break;
                }
            }
            return valid;
        };
        
        $scope.closeKeyboard = function(){
            closeKeyboard;
        };
        
    });
    
    app.directive('newProfile', function(){
        
        return {
            restrict: 'A',
            controller: function($scope, $state){
                $scope.back = function(){
                    $state.go('profiles');
                };
            }
        }
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
			controller: function($scope, DamageManager, $ionicPopup, $element, $ionicGesture){
				var record = {};
				var recordTimeout = null;
                
                $ionicGesture.on('hold', showHistory, $element);
                
                $scope.$on('$destory', function cleanup(){
                    $ionicGesture.off('hold', showHistory, $element);
                    $scope.off('$destory');
                });
				
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
                        case 'commanderCost':
                            $scope.player.commanderCost += val;
                            if($scope.player.commanderCost < 0) $scope.player.commanderCost = 0;
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
                
                function showHistory(){
                    $ionicPopup.show({
						template: '',
						tite: 'This is a test',
						subTitle: 'History will be shown later',
						scope: $scope,
						buttons: [{text: 'OK'}]
					});
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
	
	app.directive('profileList', function(){
		return {
			restrict: 'E',
			transclude: false,
			controller: function($scope, Preferences, $state){
				$scope.getProfiles = function(){
					return Preferences.getProfiles();
				};
                $scope.createProfile = function(){
                    $state.go('newProfile');
                };
                $scope.deleteProfile = function(profile){
                    Preferences.deleteProfile(profile.name);
                };
                
			},
			templateUrl: 'profileList.html'
		}
	});
	
	
	/////////////////////
	// Utility functions
	/////////////////////
	
	function highlightElement(elem){
		var activeElem = document.getElementsByClassName('active')[0];
		if(activeElem){
			activeElem.className = activeElem.className.replace(' active', '');
		}
		elem.className += " active";
	}
	
	function hapticFeedback(){
		if(navigator && navigator.notification){navigator.notification.vibrate(60);}
	}
    
    function closeKeyboard(){
        if(cordova && cordova.plugins.Keyboard)cordova.plugins.Keyboard.close();
    }

})();