#Better Swipe Access

* Input parsing is reasonably done, needs testing.
* Check out excel4node https://www.npmjs.com/package/excel4node for exporting a csv file.
* Maybe use readable stream or something over jquery 'keyup' 
1. Create readable string from input value.
2. Use readline module to trigger action when value appears. 
3. Do the things.
4. Clear input/reset UI.


BSA is an ugly-yet-functional card-swipe access system built with nwjs (formerly node-webkit). Originally built to be used with a usb magnetic card reader. Users can swipe in and out, be added, modified or deleted, and have different levels of authorization. Also logs are kept of all user activity with start time, end time and duration.

To run in development (on mac) (w/ nw.js installed) from better_swipe working directory:

    ~/nwjs-sdk-v0.17.4-osx-x64/nwjs.app/Contents/MacOS/nwjs .

To build windows version (or see nwbuild docs):

    nwbuild -p win32 .

Default Admin User:

    %B56433012345678

Access Levels:
 1. In Training
 2. Normal
 3. Advanced
 4. Staff
 5. Admin

TODOs:
- Export CSV Logs
- Tool Loan
- Color Coding Logged In Users
- Logging & Code Clean
