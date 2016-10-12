// Example Swipe:
// %B5643302765440301^LYNCH/JOHN C              ^491212000000?;5643302765440301=491212000000?

// WE ARE USING NEDB AND WE ARE GOING TO LIKE IT.
// FINDONE(X) IS NOT WORKING ATM.... DEBUG.

var low = require('lowdb');
var db = low(nw.App.dataPath + '/db.json');
db.defaults({ logs: [], users: [] }).value();
db.set('users', []).value();
db.get('users').push({
    "firstname": "Sean",
    "lastname": "Lynch",
    "idnum": 27654403,
    "level": 5,
    "provisional": false
}).value();

var Datastore = require('nedb');
var path = require('path');

var users = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'users.db') });
var users = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'logs.db') });

users.insert({
    "firstname": "Sean",
    "lastname": "Lynch",
    "idnum": 27654403,
    "level": 5,
    "provisional": false
});

users.findOne({ idnum: 27654403 }, function (err, docs) {
  console.log("X", docs[0]);
});

var gui = require('nw.gui');

// var jsonfile = require('jsonfile');
// jsonfile.spaces = 2;
// var logs = './userLog.json';
// var userDB = './users.json';

// In memory array of users
var currUsers = [];
console.log('At Startup', currUsers[0]);

// Main Event Loop
var timeout = null;
$('#input').on('keyup', function (e) {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    // Gather inputs.
    var input = $(e.target).val();
    var valid = input.includes("%B564330");
    var num = input.substring(8, 16);
    // var lastname = input.substring(input.indexOf('^') + 1, input.indexOf('/'));

    console.log('At start', currUsers);

    // React to swipe.
    if (valid) {
      var userPresent = currUsers.filter(function (elem, index, arr) { return elem.idnum == num; });
      // console.log(userPresent[0].idnum);
      if (Object.keys(userPresent).length > 0) {
        // Remove and log user
        console.log("Removing user", userPresent[0].idnum);
        currUsers = currUsers.filter(function (user, index, arr) {
          return user.idnum != userPresent[0].idnum;
        });
        var now = moment();
        var hrs = now.diff(userPresent[0].sessionStart, 'hours');
        var min = now.diff(userPresent[0].sessionStart, 'minutes');
        var duration = hrs + " hrs : " + min + " min";
        var log = {
          'firstname': userPresent[0].firstname,
          'lastname': userPresent[0].lastname,
          'idnum': userPresent[0].idnum,
          'level': userPresent[0].level,
          'starttime': userPresent[0].sessionStart.format('L LT'),
          'startmoment': userPresent[0].sessionStart,
          'endtime': now.format('L LT'),
          'duration': duration
        }
        // (((HERE)))
        db.get('logs').push(log).value();
        renderUserList();

        // jsonfile.readFile(logs, function(err, obj) {
        //   if (err) throw err;
        //   obj.main.push(log);
        //   jsonfile.writeFileSync(logs, obj);
        //   renderUserList();
        // });
      } else {
        // Add user to current list
        console.log("Adding user", num);
        // (((HERE)))
        try {
          // WTF IS GOING ON, SHOULD NOT BE THIS HARD TO "GET"
          console.log("A", db.get('users').filter({ 'idnum': num }).take(1).value());
          console.log("B", db.get('users').filter({ 'idnum': num }).take(1).clone().value());
          var existingUser = db.get('users').filter({ 'idnum': num }).take(1).clone();
          if (existingUser.provisional) { alert("Please see professional staff."); }
          existingUser.sessionStart = moment();
          currUsers.push(existingUser);
          renderUserList();
        } catch (e) {
          if (e instanceof TypeError) {
            console.log(e);
            alert("User is not in system. Ask an admin to add them.");
            renderUserList();
          }
        }
        // jsonfile.readFile(userDB, function(err, obj) {
        //   if (err) throw err;
        //   var tmpUserData = obj.main.filter(function (usr, idx) {
        //     return usr.idnum == num;
        //   });
        //   if (tmpUserData[0].level == 2) { alert("Please see professional staff."); }
        //   tmpUserData[0].sessionStart = userSessionStart;
        //   currUsers.push(tmpUserData[0]);
        //   renderUserList();
        // });
      }
      $('#input').val('');
    } else {
      // Invalid Swipe
      $('#input').val('');
      $('#input').focus();
      $('.fluid.action.input').addClass('error');
    }
  }, 500);
});

// UI
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
  $('#userList').html('');
  console.log('pre-render', currUsers);
  currUsers.forEach(function (user) {
    console.log(user);
    $('#userList').append('<div class="item">' +
        '<i class="configure icon"></i>' +
        '<div class="content">' +
          user.level + ' |  ' + user.idnum + ' | ' + user.firstname + ' ' + user.lastname +
        '</div>' +
    '</div>');
  });
  var authorization = currUsers.filter(function (item) {
    return (item.level > 4);
  });
  // console.log(authorization);
  if (authorization.length > 0) {
    $('#add').removeClass('disabled');
    $('#edit').removeClass('disabled');
    $('#delete').removeClass('disabled');
  } else {
    resetUI();
  }
};
