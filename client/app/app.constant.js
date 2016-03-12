(function(angular, undefined) {
  angular.module("galaxyApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin",
		"student",
		"teacher",
		"producer"
	]
})

;
})(angular);