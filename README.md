# Better Swipe Access

## Features

* Usable with magnetic stripe and nfc readers.
* Add, modify, and delete users.
* Users have different levels of access.
* Access Management (swipe in, swipe out).
* Reporting (start, end times, exports to csv).

## Installation

Build for win32.

Place into `C:\\better_swipe\current_version\`

Be aware of paths for datastores and for csv export.

Create desktop alias.

## Usage

Access Levels:
 1. In Training
 2. Normal
 3. Advanced
 4. Staff
 5. Admin

Default Admin User: (old)%B56433012345678 (new)12345678

## Development

To run in development (on mac) (w/ nw.js installed) from better_swipe working directory:

`~/nwjs-sdk-v0.17.4-osx-x64/nwjs.app/Contents/MacOS/nwjs .`

To build windows version (or see nwbuild docs):

`nwbuild -p win32 .`

`sudo npm run build_linux`

## License 

MIT

## Notes/Future Additions

- Tool Loan
- Color Coding Logged In Users
- Logging & Code Clean
- Fix paths between win & linux.
- Find a better method for main event loop.

