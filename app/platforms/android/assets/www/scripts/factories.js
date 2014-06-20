(function(){
	var app = angular.module('Factories',[]);
		
	app.factory('DamageManager', function(){
		var scope;
		function setScope(activeScope){
			scope = activeScope;
		}
		
		function updateAttr(val){
			if(scope) scope.updateAttr(val);
		}
		
		return {
			'setScope': setScope,
			'updateAttr': updateAttr
		};
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

})();