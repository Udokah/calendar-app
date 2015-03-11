var app = angular.module('calendarApp', [
    'ngAnimate',
    'ui.router',
    'calendarApp.controllers',
    'calendarApp.events.services'
]);

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home',{
            url: '/',
            templateUrl:'app/views/home.html',
            controller: 'HomeController'
        });
});

app.constant('calendarAppConfig', {
    EventsDB: 'Events',
    days: ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'],
    months: ['january','february','march','april','may','june','july','august','september','october','november','december']
});