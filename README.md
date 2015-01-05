ng-log-stats
============

Script that logs number of watchers and $digest fn execution time to the console.

I needed something to perform basic profiling of my ng-app so I come up with this script.
The idea is to load this script when you need it (you can use code below) and it will start outputting statistics to your console with 1s interval.

Installation
------------

You can install ``ng-log-stats`` via bower

```
bower install ng-log-stats
```

or you can use console in dev tools to load the script in browser:
```
var script = document.createElement('script');
script.src = "https://raw.githubusercontent.com/mlruzic/ng-log-stats/master/src/ng-log-stats.js";
document.getElementsByTagName('head')[0].appendChild(script);
```

Credits
-------
Used [this answer](http://stackoverflow.com/a/18539624) on stackoverflow to improve watch counter fn
