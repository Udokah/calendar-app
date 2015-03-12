describe('Testing Services', function(){
    var storedEvents = JSON.parse('{"2015":{"march":{"7":[],"12":[{"title":"Download Movie","description":"Forrest Gump","date":"2015-03-11T23:00:00.000Z"}],"26":[{"title":"An event","description":"event description","date":"2015-03-25T23:00:00.000Z"}]},"february":{"8":[{"title":"Birthday","description":"lsdkjsdlkjfsdf","date":"2015-02-07T23:00:00.000Z"}]},"december":{"25":[{"title":"Christmas Day","description":"Merry Christmas","date":"2015-12-24T23:00:00.000Z"}]}}}');

    describe('when event.remove is called', function(){

        it('should return empty array', function(){
            var $injector = angular.injector(['calendarApp']);
            var myService = $injector.get('eventService');
            var event = {title: "an event", description: "the description", date: "2015-03-25T23:00:00.000Z"};
            expect(myService.remove(event,0,storedEvents)).toEqual([]);
        });

    });

});