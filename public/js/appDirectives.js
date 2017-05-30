angular.module('directiveApp',[]).directive('countdown', [
    'Util',
    '$interval',
    function (Util, $interval) {
        return {
            restrict: 'E',
            scope: { date: '@' },
            link: function (scope, element) {
                var future;
                future = new Date(scope.date);
                $interval(function () {
                    var diff;
                    diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                    return element.html(Util.dhms(diff));
                }, 1000);
            }
        };box
    }
]).factory('Util', [function () {
    return {
        dhms: function (t) {
            var days, hours, minutes, seconds;
            days = Math.floor(t / 86400);
            t -= days * 86400;
            hours = Math.floor(t / 3600) % 24;
            t -= hours * 3600;
            minutes = Math.floor(t / 60) % 60;
            t -= minutes * 60;
            seconds = t % 60;
            var html = `<div class='box'>
                <div class='title'>${days}</div>
                <div>days</div>
            </div>
            <div class='box'>
                <div class='title'>${hours}</div>
                <div>hours</div>
            </div>
            <div class='box'>
                <div class='title'>${minutes}</div>
                <div>mins</div>
            </div>
            <div class='box'>
                <div class='title'>${seconds}</div>
                <div>secs</div>
            </div>`
            return html;
        }
    };
}]);