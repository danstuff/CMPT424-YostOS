/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = /** @class */ (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Displays your approximate location.");
            this.commandList[this.commandList.length] = sc;
            // oracle
            sc = new TSOS.ShellCommand(this.shellOracle, "oracle", "<string> - Consult the sacred oracle with any question.");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Change the Host Log status message.");
            this.commandList[this.commandList.length] = sc;
            // crash/BSOD tester
            sc = new TSOS.ShellCommand(this.shellCrash, "crash", "<string> - Cause a crash with an error message.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Load and validate the User Program Input.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        Shell.prototype.predictInput = function (buffer) {
            var prediction = "";
            //iterate through the command list and try to find a match for buffer
            for (var i in this.commandList) {
                var sc = this.commandList[i];
                if (sc.command.startsWith(buffer)) {
                    prediction = sc.command.replace(buffer, "");
                }
            }
            return prediction;
        };
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " +
                    _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "yostos":
                        _StdOut.putText("YostOS is a browser-based virtual operating system." +
                            "It's written in typescript and based on Alan Labouseur's " +
                            "TSOS-2019 template. Despite its flaws, it is indisputably " +
                            "better than Windows Vista.");
                        break;
                    case "ver":
                        _StdOut.putText("Ver displays the operating system name and current version.");
                        break;
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shutdown deactivates the OS but leaves the virtual hardware running.");
                        break;
                    case "cls":
                        _StdOut.putText("Cls clears the screen and resets the cursor to position zero.");
                        break;
                    case "man":
                        _StdOut.putText("Usage: man <topic>");
                        _StdOut.advanceLine();
                        _StdOut.putText("Man displays detailed information about a specific topic or command.");
                        break;
                    case "trace":
                        _StdOut.putText("Usage: trace <on | off>");
                        _StdOut.advanceLine();
                        _StdOut.putText("Trace turns the OS trace in the Host Log on or off.");
                        break;
                    case "rot13":
                        _StdOut.putText("Usage: rot13 <string>");
                        _StdOut.advanceLine();
                        _StdOut.putText("Rot13 performs ceaser-cipher-style rot13 encryption on <string>.");
                        break;
                    case "prompt":
                        _StdOut.putText("Usage: prompt <string>");
                        _StdOut.advanceLine();
                        _StdOut.putText("Prompt sets the prompt that appears before any text you enter. " +
                            "Default is '>'");
                        break;
                    case "date":
                        _StdOut.putText("Date displays the current date and time according to a JS Date object.");
                        break;
                    case "whereami":
                        _StdOut.putText("Whereami shows your current latitude and longitude using the" +
                            " HTML5 geolocation system.");
                        break;
                    case "oracle":
                        _StdOut.putText("Usage: oracle <string>");
                        _StdOut.advanceLine();
                        _StdOut.putText("Oracle allows you to ask a holy oracle (definitely not RNG) for " +
                            "the answer to your life's toughest questions.");
                        break;
                    case "status":
                        _StdOut.putText("Usage: status <string>");
                        _StdOut.advanceLine();
                        _StdOut.putText("Status changes the message that appears above the host log window.");
                        break;
                    case "crash":
                        _StdOut.putText("Usage: crash <string>");
                        _StdOut.advanceLine();
                        _StdOut.putText("Crash allows you to immediately crash the OS with an error message.");
                        break;
                    case "load":
                        _StdOut.putText("Load validates and processes assembly from the User Program Input." +
                            "All code must be in the form of hex values separated by spaces.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function (args) {
            //JS comes with a built-in date object that displays the current date, so we just use that.
            var d = new Date();
            _StdOut.putText(d.toString());
        };
        Shell.prototype.shellWhereAmI = function (args) {
            //HTML5 has a handy geolocation function to find lat/lng.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (pos) {
                    _StdOut.putText("Here is your current...");
                    _StdOut.advanceLine();
                    _StdOut.putText("  Latitude: " + pos.coords.latitude);
                    _StdOut.advanceLine();
                    _StdOut.putText("  Longitude: " + pos.coords.longitude);
                    _StdOut.advanceLine();
                });
            }
            else {
                _StdOut.putText("Your browser does not support geolocation.");
            }
        };
        Shell.prototype.shellOracle = function (args) {
            //don't tell anyone, but the oracle is actually not sacred or anything.
            //it just picks some words from your input sentence and tries to make a randomized sentence
            //using some predefined adjectives and verbs.
            if (args.length > 0) {
                var randMax = function (max) {
                    return Math.floor(max * Math.random());
                };
                var adjectives = ["holy", "great", "sexy", "opulent", "magnanimous", "verdant",
                    "all-mighty", "luxurious", "fortunate", "promiscuous", "rancorous", "mountainous"];
                var verbs = ["make", "do", "is", "was", "exist in", "run from", "is not", "do not"];
                var adjective0 = adjectives[randMax(adjectives.length)];
                var adjective1 = adjectives[randMax(adjectives.length)];
                var noun0 = args[randMax(args.length)].toLowerCase().replace("/r", "/");
                var noun1 = args[randMax(args.length)].toLowerCase().replace("/r", "/");
                var verb = verbs[randMax(verbs.length)];
                _StdOut.putText("[ORACLE] " + adjective0 + " " + noun0 + " " + verb +
                    " " + adjective1 + " " + noun1 + ".");
            }
            else {
                _StdOut.putText("[ORACLE] Hurry up and ask a question; I'm very busy today.");
            }
        };
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                var statusElem = document.getElementById("divStatus");
                if (statusElem) {
                    var statusStr = "";
                    for (var a in args) {
                        statusStr = statusStr + " " + args[a];
                    }
                    statusStr = statusStr.slice(1);
                    statusElem.innerHTML = statusStr;
                    _StdOut.putText("Changed Status to '" + statusStr + "'");
                }
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellCrash = function (args) {
            if (args.length > 0) {
                var crashMsg = "";
                for (var a in args) {
                    crashMsg = crashMsg + " " + args[a];
                }
                crashMsg = crashMsg.slice(1);
                _Kernel.krnTrapError(crashMsg);
            }
            else {
                _Kernel.krnTrapError("No error message provided.");
            }
        };
        Shell.prototype.shellLoad = function (args) {
            var inputElem = document.getElementById("taProgramInput");
            var inputStr = inputElem.value;
            //split input into individual hex numbers by whitespace
            var hexStrList = inputStr.split(" ");
            var hexList = [];
            for (var i in hexStrList) {
                var hexStr = hexStrList[i].trim();
                //for now, I'm doing super strict syntax checking.
                //every hex number must be 2 digits and contain only 0-9, a-f, or A-F
                if (hexStr.length == 2 &&
                    hexStr.match(/[a-fA-F0-9][a-fA-F0-9]/g)) {
                    hexList[hexList.length] = parseInt(hexStr, 16);
                }
                else if (hexStr != "") {
                    _StdOut.putText("ERROR - Unrecognized term '" + hexStr + "'. Load failed.");
                    return;
                }
            }
            _StdOut.putText("Load successful.");
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
