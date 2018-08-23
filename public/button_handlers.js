$(function () {

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
  var _id = $('.add input[name="id-num"]').val();
  var level = $('.add #level').val();
  var prov = $('.add #provisional').is(':checked');
  var newUser = {
    "firstname": firstname,
    "lastname": lastname,
    "_id": Number(_id),
    "level": level,
    "provisional": prov
  }
  global.users.insert(newUser, function (err, resDoc) {
    $('.add input[name="id-num"]').val('');
    $('.ui.modal.add').modal('hide');
  });
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
  var _id = Number($('.delete input[name="id-num"]').val());
  global.users.remove({ '_id': _id}, {}, function (err, res) {
    $('.delete input[name="id-num"]').val('');
    $('.ui.modal.delete').modal('hide');
  });
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
  var _id = $('.edit input[name="id-num"]').val();
  var level = $('.edit #level').val();
  var prov = $('.edit #provisional').is(':checked');
  var updatedUser = {
    "firstname": firstname,
    "lastname": lastname,
    "_id": Number(_id),
    "level": level,
    "provisional": prov
  }
  global.users.update({ '_id': Number(_id)}, updatedUser, {}, function (err, num, docs) {
    console.log(err, num, docs);
    $('.ui.modal.edit').modal('hide');
  });
});

// ========= Logs =========

$('#export').on('click', function (e) {
  e.preventDefault();

  console.log('exporting csv file');

  global.exportLogs();
});

$('#all').on('click', function (e) {
  e.preventDefault();
  // (((HERE)))
  global.logs.find({}, function (err, docs) {
    docs.forEach(function (log, i) {
      $('#logsList').append(
        '<div class="item">' +
          '<div class="content">' +
            '#' + i + ' | ' + log.level + ' |  ' + log.idnum + ' ' + log.lastname + ' | ' + log.starttime + ' | ' + log.duration +
          '</div>' +
        '</div>'
      );
    });
    $('.ui.modal.logs').modal('refresh').modal('show');
  });
});

$('#today').on('click', function (e) {
  e.preventDefault();
  var atm = moment();

  global.logs.find({ $where: function () {
    return moment(this.startmoment).isSame(atm, 'day');
  }}, function (err, docs) {
    docs.forEach(function (log, i) {
      $('#logsList').append('<div class="item">' +
          '<div class="content">' +
            '#' + i + ' | ' + log.level + ' |  ' + log.idnum + ' ' + log.lastname + ' | ' + log.starttime + ' | ' + log.duration +
          '</div>' +
      '</div>');
    });
    $('.ui.modal.logs').modal('refresh').modal('show');
  });
});

$('#logsClose').on('click', function (e) {
  e.preventDefault();
  $('#logsList').html('');
  $('.ui.modal.logs').modal('hide');
});

// ========= Misc. =========

$('.help_button').on('click', function (e) {
  gui.Shell.openExternal("https://github.com/SeanCLynch/better_swipe_access/blob/master/public/help.txt");
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
  global.currUsers.forEach(function (usr, i) {
    // console.log("Removing user", usr._id);

    var now = moment();
    var hrs = now.diff(usr.sessionStart, 'hours');
    var min = now.diff(usr.sessionStart, 'minutes');
    var duration = hrs + " hrs : " + min + " min";
    var log = {
      'firstname': usr.firstname,
      'lastname': usr.lastname,
      '_id': usr._id,
      'level': usr.level,
      'starttime': usr.sessionStart.format('L LT'),
      'startmoment': usr.sessionStart,
      'endtime': now.format('L LT'),
      'duration': duration
    };
    global.logs.insert(log, function (err, res) {
      console.log("Quitting. Saved:", res._id);
    });
  });
  nw.App.quit();
});

});
