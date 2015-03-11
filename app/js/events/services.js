/**
 * Created by @thisisudo on 3/10/15.
 */

var services = angular.module('calendarApp.events.services', []);

services.factory('eventService', function(calendarAppConfig){
    var factory = {};
    var EventsDB = calendarAppConfig.EventsDB ;
    var months = calendarAppConfig.months ;

    factory.create = function(event,operatingDate){
        var today = operatingDate ;
        var thisMonth = months[today.getMonth()];
        var thisDay = today.getDate() ;
        var thisYear = today.getFullYear() ;
        var EventData = {} ;
        event.date = today ;
        var storedData = localStorage.getItem(EventsDB);

        if(storedData != null){ // Local storage data exists
            EventData = JSON.parse(storedData) ;
            if(EventData[thisYear].hasOwnProperty(thisMonth)){
                if(typeof EventData[thisYear][thisMonth][thisDay] != 'undefined' ){
                    EventData[thisYear][thisMonth][thisDay].push(event);
                }else{
                    EventData[thisYear][thisMonth][thisDay] = [] ;
                    EventData[thisYear][thisMonth][thisDay].push(event);
                }
            }else{
                EventData[thisYear][thisMonth] = {};
                EventData[thisYear][thisMonth][thisDay] = [] ;
                EventData[thisYear][thisMonth][thisDay].push(event);
            }
        }else{
            EventData[thisYear] = {}  ;
            EventData[thisYear][thisMonth] = {} ;
            EventData[thisYear][thisMonth][thisDay] = [] ;
            EventData[thisYear][thisMonth][thisDay].push(event) ;
        }

        localStorage.setItem(EventsDB, JSON.stringify(EventData));
    };

    factory.remove = function(event,key){
        var storedEvents = JSON.parse(localStorage.getItem(EventsDB));
        var date = new Date(event.date) ;
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var day = date.getDate();
        var eventsArray = storedEvents[year][month][day];
        eventsArray.splice(key,1);
        storedEvents[year][month][day] = eventsArray;
        localStorage.setItem(EventsDB,JSON.stringify(storedEvents));
        return eventsArray;
    };

    factory.edit = function(event,key){
        var storedEvents = JSON.parse(localStorage.getItem(EventsDB));
        var date = new Date(event.date) ;
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var day = date.getDate();
        storedEvents[year][month][day][key] = event ; // replace data
        localStorage.setItem(EventsDB, JSON.stringify(storedEvents));
    };

    return factory;

});