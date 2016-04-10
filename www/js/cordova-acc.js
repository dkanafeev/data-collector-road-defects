/*
 * Copyright (c) 2013-2015, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, acc:false, moment:false */
/*global addClass:false, removeClass:false */


window.acc = window.acc || {} ;         // don't clobber existing acc object


// The console.log() messages sprinkled in this file are for instruction and debug.
// If you reuse this code you do not need to include them as part of your own app.
// Set to "true" if you want the console.log messages to appear.
var mWriter;
document.addEventListener("deviceready", onDeviceReady, false);
acc.LOG = true ;
acc.consoleLog = function() {           // only emits console.log messages if acc.LOG != false
    "use strict" ;
    if( acc.LOG ) {
        var args = Array.prototype.slice.call(arguments, 0) ;
        console.log.apply(console, args) ;
    }
} ;



// TODO: add use of browser DeviceMotionEvent and DeviceOrientationEvent
// see: http://www.html5rocks.com/en/tutorials/device/orientation/

acc.watchIdAccel = null ;               // holds the accelerometer "watch ID" handle

//var mWriter;

//document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
//
function onDeviceReady() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
    acc.consoleLog("path to file", fileSystem.root.fullPath);
    //fileSystem.root.getDirectory("storage", {create: true, exclusive: false}, gotFileDir, fail);
    //fileSystem.root.getFile("accel.txt", {create: true, exclusive: false}, gotFileEntry, fail);
    fileSystem.root.getDirectory("storage", {create: true, exclusive: false}, 
                                 function(fileDir) {
                                        console.log(fileDir.fullPath);
                                        fileDir.getDirectory("emulated", {create: true, exclusive: false}, 
                                            function(fileDir) {
                                                console.log(fileDir.fullPath);                                                                            fileDir.getDirectory("0", {create: true, exclusive: false}, 
                                                gotFileDir,
                                                function(error) {
                                                    console.log("Err: " + error.code);
                                                });
                                                },
                                            function(error) {
                                                console.log("Err: " + error.code);
                                            });
                                    },
                                function(error) {
                                        console.log("Err: " + error.code);
                                    });
    //fileSystem.root.getFile("accel.txt", {create: true, exclusive: false}, gotFileEntry, fail);
}

function gotFileDir(fileDir) {
    acc.consoleLog("path to file", fileDir.fullPath);
    fileDir.getFile("accel.txt", {create: true, exclusive: false}, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
    acc.consoleLog("create writer"); 
}


function gotFileWriter(writer) {
    this.mWriter = writer;
    acc.consoleLog("write to file"); 
}

function fail(error) {
    acc.consoleLog("can't write to file"); 
    console.log(error.code);
}

acc.initAccel = function() {
    "use strict" ;
    var fName = "acc.initAccel():" ;
    acc.consoleLog(fName, "entry") ;

    try {
        navigator.accelerometer.clearWatch(acc.watchIdAccel) ;
        acc.consoleLog(fName, "try succeeded.") ;
    }
    catch(e) {
        acc.consoleLog(fName, "try failed:", e) ;
    }

    acc.consoleLog(fName, "exit") ;
} ;


// the following "watches" updates to accelerometer values continuously
// until the accel button is pushed a second time, which stops the "watch"

acc.btnAccel = function() {
    "use strict" ;
    var fName = "acc.btnAccel():" ;
    acc.consoleLog(fName, "entry") ;

    function onSuccess(acceleration) {
        document.getElementById('acceleration-x').value = acceleration.x.toFixed(6) ;
        document.getElementById('acceleration-y').value = acceleration.y.toFixed(6) ;
        document.getElementById('acceleration-z').value = acceleration.z.toFixed(6) ;
        document.getElementById('acceleration-t').value = acceleration.timestamp ;
        var date = new Date();
        if(mWriter == null)
            {
                acc.consoleLog("where is file????");
            }
        mWriter.write("write ");
        acc.consoleLog("write ");
        
        //mWriter.write("acc: " + date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + ":" + date.getUTCMilliseconds() + ": "+ acceleration.x.toString(10) + ":" + acceleration.y.toString(10) + ":" + acceleration.z.toString(10) + "\n");
    }

    function onFail() {
        acc.consoleLog(fName, "Failed to get acceleration data.") ;
    }


    if( acc.watchIdAccel === null ) {
        try {                               // watch and update accelerometer values every 500 msecs
            acc.watchIdAccel = navigator.accelerometer.watchAcceleration(onSuccess, onFail, {frequency:500}) ;
            addClass("cl_btnOn", document.getElementById("id_btnAccel")) ;
            acc.consoleLog(fName, "btnAccel enabled.") ;
        }
        catch(e) {
            acc.consoleLog(fName, "try failed - device API not present?", e) ;
        }
    }
    else {
        navigator.accelerometer.clearWatch(acc.watchIdAccel) ;
        acc.watchIdAccel = null ;
        removeClass("cl_btnOn", document.getElementById("id_btnAccel")) ;
        acc.consoleLog(fName, "btnAccel disabled.") ;
    }

    acc.consoleLog(fName, "exit") ;
} ;




acc.watchIdCompass = null ;                 // holds the compass "watch ID" handle

acc.initCompass = function() {
    "use strict" ;
    var fName = "acc.initCompass():" ;
    acc.consoleLog(fName, "entry") ;

    try {
        navigator.compass.clearWatch(acc.watchIdCompass) ;
        acc.consoleLog(fName, "try succeeded.") ;
    }
    catch(e) {
        acc.consoleLog(fName, "try failed:", e) ;
    }

    acc.consoleLog(fName, "exit") ;
} ;


// the following "watches" updates to the compass continuously
// until the compass button is pushed a second time, which stops the "watch"

acc.btnCompass = function() {
    "use strict" ;
    var fName = "acc.btnCompass():" ;
    acc.consoleLog(fName, "entry") ;

    function onSuccess(heading) {
        document.getElementById('compass-dir').value = heading.magneticHeading.toFixed(6) ;
    }

    function onFail(compassError) {
        acc.consoleLog(fName, "Compass error: " + compassError.code) ;
    }


    if( acc.watchIdCompass === null ) {
        try {                               // watch and update compass value every 500 msecs
            acc.watchIdCompass = navigator.compass.watchHeading(onSuccess, onFail, {frequency:500}) ;
            addClass("cl_btnOn", document.getElementById("id_btnCompass")) ;
            acc.consoleLog(fName, "btnCompass enabled.") ;
        }
        catch(e) {
            acc.consoleLog(fName, "try failed - device API not present?", e) ;
        }
    }
    else {
        navigator.compass.clearWatch(acc.watchIdCompass) ;
        acc.watchIdCompass = null ;
        removeClass("cl_btnOn", document.getElementById("id_btnCompass")) ;
        acc.consoleLog(fName, "btnCompass disabled.") ;
    }

    acc.consoleLog(fName, "exit") ;
} ;
