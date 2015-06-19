#! /usr/bin/env node

// See: https://wiki.archlinux.org/index.php/Desktop_entries#Application_entry

var path  = require('path'),
    glob  = require('glob'),
    osenv = require('osenv'),
    fs    = require('fs'),
    cp    = require('child_process');

var applications = [
  '/usr/share/applications',
  '/usr/local/share/applications',
]; 
var programs = {};

applications.forEach(function(item) {
  var dir = item.replace('~', osenv.home());
  var files = glob.sync( path.join( dir, '**/*.desktop' ) );

  files.forEach(function(path) {
    var content = fs.readFileSync(path).toString();
    var name = content.match(/Name=([\w ]+)/)[1];
    var command = content.match(/Exec=(.*)/)[1].replace(/\%([A-Za-z])/g, '');

    if(name !== undefined && command !== undefined) {
      programs[name] = command;
    }
  });
});

var command = "echo -e '" + Object.keys(programs).join('\n') + "' | dmenu -i";

cp.exec(command, function(err, stdout, stderr) {
  console.log( programs[ stdout.replace('\n', '') ] );
});
