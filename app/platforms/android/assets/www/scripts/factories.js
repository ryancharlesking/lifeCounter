(function(){
	var PREF_KEY = 'lifeCounterPreferences';
	var PROFILES_KEY = 'profiles';
	var PROFILE_KEY = 'profile';
	
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
	
	app.factory('Preferences', function(){
		var preferences = JSON.parse(localStorage.getItem(PREF_KEY));
		
		if(!preferences){
			preferences = {};
			localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
		}
		
		/**
		 * Gets the user's currently saved profiles
		 * @return {Array}
		 */
		function getProfiles(){
			var profiles = getPreference(PROFILES_KEY);
			if(!profiles){
				updatePreference(PROFILES_KEY, []);
				profiles = [];
			}
			return profiles.concat();
		}
		
		/**
		 * Adds a new profile to the list of saved profiles
		 * @param newProfile {Object} JSON data of the profile to be saved
		 * @return {Array}
		 */
		function addProfile(newProfile){
            var profiles = getProfiles();
            profiles.push(newProfile);
			updatePreference(PROFILES_KEY, profiles);
			return getProfiles();
		}
		
		/**
		 * Deletes a saved profile
		 * @param profileName {String} The name of the profile to delete
		 * @return {Array}
		 */
		function deleteProfile(profileName){
			var profiles = getProfiles();
			for(var i=0, len=profiles.length; i<len; i++){
				if(profiles[i].name === profileName){
					profiles.splice(i,1);
					break;
				}
			}
			updatePreference(PROFILES_KEY, profiles);
			return getProfiles();
		}
        
        /**
         * Gets the default profile for the user
         *
         * returns {Object}
         */
        function getProfile(){
            return getPreference(PROFILE_KEY);
        }
        
        /**
         * Sets the default profile for the user
         *
         * @param profile {Object}
         */
        function setProfile(profile){
            return updatePreference(PROFILE_KEY, profile);
        }
		
		/**
		 * Gets a specified preference
		 * @param pref {String} The name of the preference to get
		 * @return {*}
		 */
		function getPreference(pref){
			return preferences[pref];
		}
		
		/**
		 * Saves a specified preference to storage
		 * @param pref {String} The name of the preference to update
		 * @param val {*} The value to be saved
		 * @return {*}
		 */
		function updatePreference(pref, val){
			preferences[pref] = val;
			try{
				localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
			} catch (e) {
				if(console) console.log('Invalid preference format');
			}
			return preferences[pref];
		}
		
		return {
			'getProfiles': getProfiles,
			'deleteProfile': deleteProfile,
			'addProfile': addProfile,
			'getProfile': getProfile,
			'setProfile': setProfile
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