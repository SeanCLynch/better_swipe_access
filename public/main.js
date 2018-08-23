
// Setup
var gui = require('nw.gui');
var Datastore = require('nedb');
let fs = require('fs');
let json2csv = require('json2csv').Parser;


// could use path.join and any of the following as the 'filename' arg to try and automatically load db.
// console.log(process.cwd(), process.env.PWD, path.resolve(), gui.App.dataPath);
var path = require('path');
// global.users = new Datastore({ filename: path.join(process.env.PWD, 'swipe_access_users.db'), autoload: true });
// global.logs = new Datastore({ filename: path.join(process.env.PWD, 'swipe_access_logs.db'), autoload: true });

// DBs for production.
global.users = new Datastore({ filename: 'C:\\better_swipe\\swipe_access_users.db', autoload: true });
global.logs = new Datastore({ filename: 'C:\\better_swipe\\swipe_access_logs.db', autoload: true });
global.currUsers = [];

$(function () {

// Start Logs
global.users.count({}, function (err1, count1) {
  global.logs.count({}, function (err2, count2) {
    console.log('Init | U:', count1, 'L:', count2, 'C:', global.currUsers);
    if (count1 <= 1) {
      global.users.insert({
        "firstname": 'Admin',
        "lastname": 'Admin',
        "_id": 12345678,
        "level": 5,
        "provisional": false
      }, function (error, res) {
        console.log("Admin Account Added, Copy This: %B56433012345678 12345678 42009755");
      });
    } else {
      global.users.remove({ '_id': 12345678}, {}, function (err, numRem) {
        global.users.find({}, function (err3, data) {
          global.logs.find({}, function (err4, data2) {
            console.log("Removed Admin", err, numRem);
            console.log("All Logs", err4, data2);
            console.log("All Docs", err3, data);
          });
        });
      });
    }
  });
});


// ===============
// Main Event Loop
// ===============

let timeout = null;

$('#input').on('keyup', function (e) {

  clearTimeout(timeout);

  timeout = setTimeout(function () {

    // Gather input.
    var num = $(e.target).val();
    let valid = num.length == 8;
    $('#input').val('');

    // Handle invalid swipes.
    if (num.length != 8) {
      $('#input').focus();
      $('.fluid.action.input').addClass('error');
      return;
    }

    // Get current user, if any.
    let currentUser = getSwipedInUser(num);

    if (currentUser) { 
      // ===== SWIPE OUT ===== //
      console.debug('swiping out user id:', currentUser._id);

      // Remove currentUser from currUsers
      global.currUsers = global.currUsers.filter(function (user) { return user._id != currentUser._id; });

      // Generate log entry.
      let logEntry = generateLog(currentUser);

      // Insert Log
      global.logs.insert(logEntry, function (err, resDoc) {
        console.debug(err, resDoc);
        renderUserList();
      });

    } else { 
      // ===== SWIPE IN ===== //
      console.debug('swiping in user id:', num);

      // So check they exist, and add them.
      global.users.findOne({ _id: Number(num)}, function (err, res) {
        console.debug(err, res);
        if (!res) { alert("No Such User Exists!"); renderUserList(); return; }
        if (res.provisional) { alert("Please see professional staff."); }
        res.sessionStart = moment();
        global.currUsers.push(res);
        renderUserList();
      });
    }

  }, 500); // end setTimeout.

});

// ================
// Helper Functions
// ================

// Returns the swiped in user, otherwise returns null.
function getSwipedInUser (user_id) {
  let matchingUser = global.currUsers.filter(function (elem) { return elem._id == user_id; });
  let user = (matchingUser.length == 1) ? matchingUser[0] : null;
  return user;
}

// Creates log object for database. 
function generateLog (currentUser) {
  var now = moment();
  var hrs = now.diff(currentUser.sessionStart, 'hours');
  var min = now.diff(currentUser.sessionStart, 'minutes');
  var duration = hrs + " hrs : " + (min % 60) + " min";
  var log = {
    'firstname': currentUser.firstname,
    'lastname': currentUser.lastname,
    'idnum': currentUser._id,
    'level': currentUser.level,
    'starttime': currentUser.sessionStart.format('L LT'),
    'startmoment': currentUser.sessionStart,
    'endtime': now.format('L LT'),
    'duration': duration
  }
  return log;
}

// Export a .csv file of all the logs up to this point. 
global.exportLogs = function () {
  console.log('exporting logs from here');

  let fields = ['firstname', 'lastname', '_id', 'idnum', 'level', 'starttime', 'endtime', 'duration'];
  let opts = { fields };

  global.logs.find({}, function (error, data) {
    try {
      let parser = new json2csv(opts);
      let csv = parser.parse(data);
      // let filename = path.join(process.env.PWD, 'test.csv');
      let filename = "C:\\better_swipe\\logs.csv";
      fs.writeFile(filename, csv, 'utf8', function (err) {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  });

}

// ============
// UI Functions
// ============

// Resets the UI to its normal state. 
var resetUI = function () {
  $('#input').focus();
  $('#input').removeClass('error');
  $('#add').addClass('disabled');
  $('#edit').addClass('disabled');
  $('#delete').addClass('disabled');
  $('#provision').addClass('disabled');
  $('#export').addClass('disabled');
}
resetUI();

// Renders the list of users on the main page. 
var renderUserList = function () {

  // Update the member list UI.
  $('#userList').html('');
  global.currUsers.forEach(function (user) {
    $('#userList').append(
      '<div class="item">' +
        '<i class="configure icon"></i>' +
        '<div class="content">' +
          user.level + (user.provisional ? 'P' : ' ') + ' |  ' + user._id + ' | ' + user.firstname + ' ' + user.lastname +
        '</div>' +
      '</div>'
    );
  });

  // Check for authorization level.
  var authorization = global.currUsers.filter(function (item) { return (item.level > 4); });
  if (authorization.length > 0) {
    $('#add').removeClass('disabled');
    $('#edit').removeClass('disabled');
    $('#delete').removeClass('disabled');
    $('#export').removeClass('disabled');
  } else {
    resetUI();
  }
};

}); // end closure
