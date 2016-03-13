(function(angular, undefined) {
  angular.module("galaxyApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"student",
		"admin",
		"instructor",
		"producer"
	]
})

;
})(angular);