## SDC - Simple (embedded javascript) Debug Logger

Tool for embedding a simple log console into your webpages. Sometimes you don't have access to 'console.log' for a simple debugging tasks. Adding this script and replacing all the 'console.log' calls with 'SDC.log' calls will help with that burden!

Console is hidden upon page load, but pressing the '`' key will toggle its visibility.

This came from a need at work where I have to deal with an embedded Windows Forms Web Browser control. Debugging javascript in this environment became a bit of a nightmare since I didn't even have access to a console. The obvious solution would be to just debug the javascript in Internet Explorer itself since that's the engine underneath the Web Browser control. Unforunately, the system at my job is tightly integrated with the WF application a lot of the time, making this impossible.

The console, currently, isn't very pretty (or extensible), but it gets the job done with little to no headache!
