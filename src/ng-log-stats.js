(function(window, angular, undefined){
    var digestFnExecutionTime = 0,
        rootScope = null,
        timestamp = null;

    if(!angular){
        throw 'Angular not found';
    }

    // prefer performance.now over Date.now
    function initTimestampFn(){
        if(window.performance){
            timestamp = function(){ 
                return window.performance.now() 
            };
        }else{
            timestamp = Date.now;
        }
    }

    function getRootScope(){
        // attribute selector (ng-app) wouldn't work if app has been
        // bootstraped manually
        return angular.element('.ng-scope').scope().$root;
    }

    // replaces $digest fn with the one that will measure the execution time of
    // the original $digest fn
    function measureDigestFnExecutionTime(){
        var originalDigest,
            rootScope = getRootScope();
        
        if(!rootScope){
            return;
        }
        
        originalDigest = rootScope.$digest;        
        rootScope.$digest = function(){
            var startTime = timestamp();
            originalDigest.apply(this, arguments);
            digestFnExecutionTime = timestamp() - startTime;
        };
    }

    function getNumberOfWatchers() {
        var rootScope = getRootScope(),
            scopes = [rootScope],
            scope = null,
            watchers = 0;
        
        if(!rootScope){
            return watchers;
        }
        
        // start with rootScope and continue with $$nextSibling and $$childHead
        while(scopes.length > 0){
            scope = scopes.pop();
            if(scope.$$watchers){
                watchers += scope.$$watchers.length;
            }                        
            if(scope.$$nextSibling){
                scopes.push(scope.$$nextSibling);
            }
            if(scope.$$childHead){
                scopes.push(scope.$$childHead);
            }
        }        
        return watchers;
    }

    // log stats to console
    function logStats(){
        if(console && console.info){
            var numWatchers = getNumberOfWatchers();
            console.info(
                'number of watchers: ', numWatchers + 
                '\n$digest fn execution time: ' + digestFnExecutionTime + ' ms'
            );
        }
    };

    // for simplicity just set up the interval every second that will output
    // current number of watchers and $digest fn execution time to console
    initTimestampFn();
    measureDigestFnExecutionTime();
    setInterval(logStats, 1000);
})(window, angular);
