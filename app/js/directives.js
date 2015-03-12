var directive = angular.module('calendarApp.directives', [ ]);

directive.directive('calendar', function(){
    return{
        restrict: 'E',
        templateUrl: 'app/templates/calendar.html',
        replace: false
    };
});