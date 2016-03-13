(function(angular, undefined) {
  angular.module("galaxyApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"student",
		"admin",
		"instructor",
		"producer"
	]
})

;
})(angular);