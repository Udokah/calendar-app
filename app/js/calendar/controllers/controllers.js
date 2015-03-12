var controllers = angular.module('calendarApp.controllers', []);

controllers.controller('HomeController', ['$scope','eventService','calendarAppConfig', function($scope,eventService,calendarAppConfig){
    /* jQuery Variables */
    var $overlay = $('.overlay');
    var $overlaySection = $('#overlaySection');
    var $addEvent = $('.addNewEvent');
    var $showEvents = $('.showEvents');
    var $chooseActions = $('.chooseAction');
    var $calendarHolder = $('#calendarHolder');

    var months = calendarAppConfig.months;
    var days = calendarAppConfig.days;
    var EventsDB = calendarAppConfig.EventsDB;

    $scope.Events = [] ;
    $scope.showEventsEmpty = false ;
    $scope.popupTitle = '' ;
    $scope.operatingDate = null ;
    $scope.newEvent = {showError: false, error:null, success:null, showSuccess:false} ;

    $scope.calendar = {
        load: function(dateObj){
            $scope.today = { year: dateObj.getFullYear(), day: dateObj.getDate(), month: months[dateObj.getMonth()], date: dateObj } ;
            $scope.days = $scope.calendar.days(dateObj);
        },
        previous: function(date) {
            if (date.getMonth() != 0) {
                date.setMonth(date.getMonth() - 1);
                $scope.calendar.load(date);
            }
        },
        next: function(date){
            if(date.getMonth() < 11){
                date.setMonth(date.getMonth() + +1 );
                $scope.days = [] ;
                $scope.calendar.load(date);
            }
        },

        days: function(dateObj){
            var days = [];
            var date = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
            var now = new Date();
            var current = '' ;
            while(date.getMonth() === dateObj.getMonth()){
                var newDate = new Date(date) ;
                if(newDate.getDate() == now.getDate() && newDate.getMonth() == now.getMonth() && newDate.getFullYear() == now.getFullYear()){
                    current = 'active btn-warning';
                }else{
                    current = ''
                }

                var hasEvents, btnTitle ;
                var check = $scope.calendar.hasEvents(newDate) ;

                if(check == false){
                    hasEvents = 'btn-default';
                    btnTitle = '' ;
                }else{
                    hasEvents = 'btn-info';
                    if(check == 1){
                        btnTitle = check + " event";
                    }else{
                        btnTitle = check + " events";
                    }
                }

                days.push( {visible:'', title:btnTitle, eventClass: hasEvents, active: current, dayOfWeek: newDate.getDay(), date: newDate, day: newDate.getDate(), month: months[newDate.getMonth()] } );
                date.setDate(date.getDate() + 1);
            }

            var dayOfWeek = days[0].dayOfWeek ;
            var loopCount = dayOfWeek - 1  ;
            if(loopCount > 0){
                for(var i=0; i<=loopCount; i++){
                    days.unshift( {visible:'invisibleMe', active: current, dayOfWeek: newDate.getDay(), date: newDate, day: newDate.getDate(), month: months[newDate.getMonth()] } );
                }
            }
            return days;
        },

        hasEvents: function(date){
            var result = false ;
            var thisYear = date.getFullYear();
            var thisMonth = months[date.getMonth()];
            var thisDay = date.getDate();

            var storedData = localStorage.getItem(EventsDB);
            var EventData ;
            if(storedData != null) { // Local storage data exists
                EventData = JSON.parse(storedData);
                /* check if this year exist*/
                if (typeof EventData[thisYear] != 'undefined'
                    && EventData[thisYear].hasOwnProperty(thisMonth)
                    && typeof EventData[thisYear][thisMonth][thisDay] != 'undefined') {
                    var eventArray = EventData[thisYear][thisMonth][thisDay] ;
                    if(eventArray instanceof Array && eventArray.length > 0){
                        result = eventArray.length ;
                    }
                }
            }
            return result ;
        }
    };

    $scope.overlay = {
        close: function(){
            $scope.newEvent.showSuccess = false ;
            $scope.newEvent.showError = false ;
            $overlaySection.addClass('animated bounceOut').delay(650).fadeOut('fast',function(){
                $overlay.fadeOut('fast');
                $showEvents.hide();
                $addEvent.hide();
                $chooseActions.show();
                $(this).removeClass('animated').removeClass('bounceOut');
            });
        },

        prompt: function(date){
            $scope.operatingDate = date ;
            $scope.popupTitle = "What do you want to do ?";
            $overlay.fadeIn('fast', function(){
                $overlaySection.slideDown('fast');
            });
        },

        addEvent: function(){
            var dt = $scope.operatingDate ;
            $scope.popupTitle = "scheduled an event for  " + days[dt.getDay()] + ", " + dt.getDate() + " " + months[dt.getMonth()] + " " + dt.getFullYear()  ;
            $chooseActions.slideUp('fast', function(){
                $addEvent.slideDown('fast');
            });
        },

        dailyEvents: function(){
            var dt = $scope.operatingDate ;
            var year = dt.getFullYear();
            var month = months[dt.getMonth()];
            var day = dt.getDate();
            var storedEvents = [];

            $scope.popupTitle = "events scheduled for " + days[dt.getDay()] + ", " + day + " " + month + " " + year;
            $chooseActions.slideUp('fast', function(){
                $showEvents.slideDown('fast');
            });

            var eventsData = JSON.parse(localStorage.getItem(EventsDB));
            if(eventsData != null && typeof eventsData[year] != 'undefined' && typeof eventsData[year][month] != 'undefined' && eventsData[year][month][day] != 'undefined'){
                storedEvents = eventsData[year][month][day] ;
            }

            if(storedEvents instanceof Array){
                if(storedEvents.length > 0 ){
                    $scope.showEventsEmpty = false;
                    $scope.Events = storedEvents ;
                }else{
                    $scope.showEventsEmpty = true ;
                    $scope.Events = [] ;
                }
            }else{
                $scope.showEventsEmpty = true ;
                $scope.Events = [] ;
            }
        },

        monthlyEvents: function(date){
            var eventsData = JSON.parse(localStorage.getItem(EventsDB)) ;
            var year = date.getFullYear();
            var month = months[date.getMonth()];
            $scope.popupTitle = "Scheduled events for the month of " + month ;
            var arrayHolder = [] ;
            if(eventsData != null && typeof eventsData[year] != 'undefined' && typeof eventsData[year][month] != 'undefined'){
                var monthEvents = eventsData[year][month] ;
                for(var day in monthEvents){
                    if(monthEvents.hasOwnProperty(day)){
                        monthEvents[day].forEach(function(item){
                            arrayHolder.push(item);
                        });
                    }
                }
            }

            if(arrayHolder.length > 0){
                $scope.showEventsEmpty = false;
                $scope.Events = arrayHolder ;
            }else{
                $scope.showEventsEmpty = true ;
                $scope.Events = [];
            }

            $overlay.fadeIn('fast', function(){
                $chooseActions.hide();
                $overlaySection.slideDown('fast', function(){
                    $showEvents.fadeIn('fast');
                });
            });
        },

        removeEvent: function(event,key){
            var storedEvents = JSON.parse(localStorage.getItem(EventsDB));
            $scope.Events = eventService.remove(event,key,storedEvents);
            $scope.calendar.load($scope.today.date);
        },

        editEvent: function(event,eventObj){
            var key = event.currentTarget.dataset.key ;
            var $parent = $("#eventItem-" + key) ;
            var $title = $parent.find('h4') ;
            var $description = $parent.find('p');
            var $editBtn = $parent.find('.btn-default');
            var $saveBtn = $parent.find('.btn-success');

            $editBtn.hide();
            $saveBtn.show();

            $title.addClass('form-control').css('width', '80%').attr('contenteditable',true);
            $description.addClass('form-control').css('width', '80%').attr('contenteditable',true);

            $saveBtn.on('click', function(){
                var event = { title: $.trim($title.text()), description: $.trim($description.text()), date: eventObj.date} ;

                eventService.edit(event,key);

                /* Reset to normal */
                $title.removeClass('form-control').css('width', '').removeAttr('contenteditable');
                $description.removeClass('form-control').css('width', '').removeAttr('contenteditable');

                $(this).hide();
                $editBtn.show();

            });
        },

        validateForm: function(event){
            if(typeof event == 'undefined'){
                $scope.newEvent.showError = true ;
                $scope.newEvent.error = "You have not entered any event information !" ;
            }else if(typeof event.title == 'undefined'){
                $scope.newEvent.showError = true ;
                $scope.newEvent.error = "Please enter a title for the event" ;
            }else if(typeof event.description == 'undefined'){
                $scope.newEvent.showError = true ;
                $scope.newEvent.error = "Please enter a description for the event" ;
            }else{
                $scope.newEvent.showError = false;
                /* Create event now */
                var storedData = localStorage.getItem(EventsDB);
                eventService.create(event,$scope.operatingDate,storedData);
                $("#resetForm").click();
                $scope.newEvent.showSuccess = true ;
                $scope.newEvent.success = "Event has been added successfully" ;
                $scope.calendar.load($scope.today.date);
            }
        }
    };

    $scope.$on('$viewContentLoaded', function(){
        $calendarHolder.addClass('animated zoomIn').show();
    });

    $scope.calendar.load(new Date());

}]);