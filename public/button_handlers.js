
// ========= User actions =========

$('#add').on('click', function (e) {
  e.preventDefault();
  $('.ui.modal.add').modal('show');
});

$('#addCancel').on('click', function (e) {
  e.preventDefault();
  $('.ui.modal.add').modal('hide');
});

$('#addSave').on('click', function (e) {
  e.preventDefault();
  var firstname = $('.add input[name="first-name"]').val();
  var lastname = $('.add input[name="last-name"]').val();
  var idnum = $('.add input[name="id-num"]').val();
  var level = $('.add #level').val();
  var prov = $('.add #provisional').is(':checked');
  var newUser = {
    "firstname": firstname,
    "lastname": lastname,
    "idnum": idnum,
    "level": level,
    "provisional": prov
  }
  // (((HERE)))
  db.get('users').push(newUser);
  $('.ui.modal.add').modal('hide');

  // jsonfile.readFile(userDB, function(err, obj) {
  //   if (err) throw err;
  //   obj.main.push(newUser);
  //   jsonfile.writeFileSync(userDB, obj);
  // });
  // $('.ui.modal.add').modal('hide');
});



$('#delete').on('click', function (e) {
  e.preventDefault();
  $('.ui.modal.delete').modal('show');
});

$('#deleteClose').on('click', function (e) {
  e.preventDefault();
  $('.ui.modal.delete').modal('hide');
});

$('#deleteButton').on('click', function (e) {
  e.preventDefault();
  var idnum = $('.delete input[name="id-num"]').val();
  // (((HERE)))
  db.get('users').remove({ 'idnum': idnum });
  // jsonfile.readFile(userDB, function(err, obj) {
  //   if (err) throw err;
  //   obj.main.filter(function (usr, i) {
  //     return usr.idnum != idnum;
  //     jsonfile.writeFileSync(userDB, obj);
  //   });
  // });
});



$('#edit').on('click', function (e) {
  e.preventDefault();
  $('.ui.modal.edit').modal('show');
});

$('#editCancel').on('click', function (e) {
  e.preventDefault();
  $('.ui.modal.edit').modal('hide');
});

$('#editSave').on('click', function (e) {
  e.preventDefault();
  var firstname = $('.edit input[name="first-name"]').val();
  var lastname = $('.edit input[name="last-name"]').val();
  var idnum = $('.edit input[name="id-num"]').val();
  var level = $('.edit #level').val();
  var prov = $('.add #provisional').is(':checked');
  var updatedUser = {
    "firstname": firstname,
    "lastname": lastname,
    "idnum": idnum,
    "level": level,
    "provisional": prov
  }
  db.get('users').find({ 'idnum': idnum}).assign(updatedUser);
  $('.ui.modal.add').modal('hide');
});

// ========= Logs =========

$('#all').on('click', function (e) {
  e.preventDefault();
  // (((HERE)))
  try {
    db.get('logs').value().forEach(function (log, i) {
      $('#logsList').append(
        '<div class="item">' +
          '<div class="content">' +
            i + ' | ' + log.level + ' |  ' + log.idnum + ' ' + log.lastname + ' | ' + log.starttime + ' | ' + log.duration +
          '</div>' +
        '</div>'
      );
    });
  } catch (e) {
    if (e instanceof TypeError) {
      $('#logsList').append('Sorry, no logs yet.');
    }
  }
  $('.ui.modal.logs').modal('refresh').modal('show');


  // jsonfile.readFile(logs, function (err, obj) {
  //   if (err) throw err;
  //   obj.main.forEach(function (log, i) {
  //     $('#logsList').append('<div class="item">' +
  //         '<div class="content">' +
  //           i + ' | ' + log.level + ' |  ' + log.idnum + ' ' + log.lastname + ' | ' + log.starttime + ' | ' + log.duration +
  //         '</div>' +
  //     '</div>');
  //   });

});

$('#today').on('click', function (e) {
  e.preventDefault();
  // (((HERE)))
  var atm = moment();
  try {
    db.get('logs').filter(function (l) {
      return moment(l.startmoment).isSame(atm, 'day');
    }).value().forEach(function (log, i) {
      $('#logsList').append('<div class="item">' +
          '<div class="content">' +
            i + ' | ' + log.level + ' |  ' + log.idnum + ' ' + log.lastname + ' | ' + log.starttime + ' | ' + log.duration +
          '</div>' +
      '</div>');
    });
  } catch (e) {
    if (e instanceof TypeError) {
      $('#logsList').append('Sorry, no logs yet.');
    }
  }

  $('.ui.modal.logs').modal('refresh').modal('show');

  // jsonfile.readFile(logs, function (err, obj) {
  //   if (err) throw err;
  //   var atm = moment();
  //   obj.main.filter(function (log, indx) {
  //     return moment(log.startmoment).isSame(atm, "day");
  //   }).forEach(function (log, i) {
  //     $('#logsList').append('<div class="item">' +
  //         '<div class="content">' +
  //           i + ' | ' + log.level + ' |  ' + log.idnum + ' ' + log.lastname + ' | ' + log.starttime + ' | ' + log.duration +
  //         '</div>' +
  //     '</div>');
  //   });
  //   $('.ui.modal.logs').modal('refresh').modal('show');
  // });
});

$('#logsClose').on('click', function (e) {
  e.preventDefault();
  $('#logsList').html('');
  $('.ui.modal.logs').modal('hide');
});

// ========= Misc. =========

$('.help_button').on('click', function () {
  gui.Shell.openExternal("https://github.com/SeanCLynch/better_swipe_access/help.txt");
});

$('.source_button').on('click', function (e) {
  gui.Shell.openExternal("https://github.com/SeanCLynch/better_swipe_access");
});

$('#reset').on('click', function (e) {
  e.preventDefault();
  $('#input').val('');
  $('#input').focus();
  $('.fluid.action.input').removeClass('error');
});

$('#shopjob').on('click', function (e) {
  e.preventDefault();
  var jobs = [
    "Organize allen keys.",
    "Clean up 'The Beast'.",
    "Clean up the bandsaw area.",
    "Organize the drill set box.",
    "Place parallels back in the appropriate place.",
    "Run through the entire speed range on the drill press.",
    "Clean the files with compressed air.",
    "Sweep floor.",
    "Clean up by the red press.",
    "Vacuum heating units behind prototracks.",
    "Refill coolant containers.",
    "Vacuum tops of drawer sets.",
    "Clean shop glasses.",
    "Cut new shop rags"
  ];
  var jobNum = Math.floor(Math.random() * jobs.length);
  alert(jobs[jobNum]);
});

$('#quit').on('click', function (e) {
  e.preventDefault();
  currUsers.forEach(function (usr, i) {
    console.log("Removing user", usr.idnum);
    var now = moment();
    var hrs = now.diff(usr.sessionStart, 'hours');
    var min = now.diff(usr.sessionStart, 'minutes');
    var duration = hrs + " hrs : " + min + " min";
    var log = {
      'firstname': usr.firstname,
      'lastname': usr.lastname,
      'idnum': usr.idnum,
      'level': usr.level,
      'starttime': usr.sessionStart.format('L LT'),
      'startmoment': usr.sessionStart,
      'endtime': now.format('L LT'),
      'duration': duration
    };
    // (((HERE)))
    db.get('logs').push(log);
    // jsonfile.readFile(logs, function(err, obj) {
    //   if (err) throw err;
    //   obj.main.push(log);
    //   jsonfile.writeFileSync(logs, obj);
    // });
  });
  renderUserList();
  nw.App.quit();
});
