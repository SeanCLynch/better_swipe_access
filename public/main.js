// Example Swipe:
// %B5643302765440301^LYNCH/JOHN C              ^491212000000?;5643302765440301=491212000000?
// %B56433012345678
// %B56433087654321

// Setup
var gui = require('nw.gui');
var Datastore = require('nedb');
var path = require('path');

global.users = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'users.db'), autoload: true  });
global.logs = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'logs.db'), autoload: true  });
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
        console.log("Admin Account Added, Copy This: %B56433012345678");
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

// Main Event Loop
var timeout = null;
$('#input').on('keyup', function (e) {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    // Gather inputs.
    var input = $(e.target).val();
    var valid = input.includes("%B564330");
    var num = input.substring(8, 16);

    // Is the swipe valid/legible?
    if (valid) {
      var swipedInUser = global.currUsers.filter(function (elem) { return elem._id == num; });

      // Is there a swiped in user?
      if (Object.keys(swipedInUser).length > 0) {
        // console.log("Removing user", swipedInUser[0]._id);

        // Remove user from currUsers
        global.currUsers = global.currUsers.filter(function (user) { return user._id != swipedInUser[0]._id; });
        // Generate Log
        var now = moment();
        var hrs = now.diff(swipedInUser[0].sessionStart, 'hours');
        var min = now.diff(swipedInUser[0].sessionStart, 'minutes');
        var duration = hrs + " hrs : " + min + " min";
        var log = {
          'firstname': swipedInUser[0].firstname,
          'lastname': swipedInUser[0].lastname,
          'idnum': swipedInUser[0]._id,
          'level': swipedInUser[0].level,
          'starttime': swipedInUser[0].sessionStart.format('L LT'),
          'startmoment': swipedInUser[0].sessionStart,
          'endtime': now.format('L LT'),
          'duration': duration
        }
        // Insert Log
        global.logs.insert(log, function (err, resDoc) {
          console.log("Inserted Log:", err, resDoc);
          renderUserList();
        });

      } else { // There is no swiped in user.
        // console.log("Adding user", num);

        // So check they exist, and add them.
        global.users.findOne({ _id: Number(num)}, function (err, res) {
          console.log("E", err, res);
          if (!res) { alert("No Such User Exists!"); renderUserList(); return; }
          if (res.provisional) { alert("Please see professional staff."); }
          res.sessionStart = moment();
          global.currUsers.push(res);
          renderUserList();
        });
      }
    } else { // The swipe is invalid.
      $('#input').focus();
      $('.fluid.action.input').addClass('error');
    }
    // Cleanup
    $('#input').val('');
  }, 500);
});

// UI Functions
var resetUI = function () {
  $('#input').focus();
  $('#input').removeClass('error');
  $('#add').addClass('disabled');
  $('#edit').addClass('disabled');
  $('#delete').addClass('disabled');
  $('#provision').addClass('disabled');
}
resetUI();

var renderUserList = function () {
  // console.log("Rendering:", currUsers);

  // Update the member list UI.
  $('#userList').html('');
  global.currUsers.forEach(function (user) {
    $('#userList').append('<div class="item">' +
        '<i class="configure icon"></i>' +
        '<div class="content">' +
          user.level + (user.provisional ? 'P' : ' ') + ' |  ' + user._id + ' | ' + user.firstname + ' ' + user.lastname +
        '</div>' +
    '</div>');
  });

  // Check for authorization level.
  var authorization = global.currUsers.filter(function (item) { return (item.level > 4); });
  if (authorization.length > 0) {
    $('#add').removeClass('disabled');
    $('#edit').removeClass('disabled');
    $('#delete').removeClass('disabled');
  } else {
    resetUI();
  }
};
});
