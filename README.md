#Better Swipe Access

## Features

* Usable with magnetic stripe and nfc readers.
* Add, modify, and delete users.
* Users have different levels of access.
* Access Management (swipe in, swipe out).
* Reporting (start, end times, exports to csv).

## Installation

Place into `C:\\better_swipe\current_version\`

Create desktop alias.

## Usage

Access Levels:
 1. In Training
 2. Normal
 3. Advanced
 4. Staff
 5. Admin

Default Admin User: %B56433012345678

## Development

To run in development (on mac) (w/ nw.js installed) from better_swipe working directory:

`~/nwjs-sdk-v0.17.4-osx-x64/nwjs.app/Contents/MacOS/nwjs .`

To build windows version (or see nwbuild docs):

`nwbuild -p win32 .`

`sudo npm run build_linux`

## License 

MIT

## Notes/Future Additions

* Input parsing is reasonably done, needs testing.
* Check out excel4node https://www.npmjs.com/package/excel4node for exporting a csv file.
* Maybe use readable stream or something over jquery 'keyup' 
1. Create readable string from input value.
2. Use readline module to trigger action when value appears. 
3. Do the things.
4. Clear input/reset UI.

TODOs:
- Tool Loan
- Color Coding Logged In Users
- Logging & Code Clean
