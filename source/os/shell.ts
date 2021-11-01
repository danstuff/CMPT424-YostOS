/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];

        constructor() {}

        public init() {
            const shell = this;
            var addCmd = function(func: any, command: string) {
                shell.commandList[shell.commandList.length] = 
                    new ShellCommand(func, command);
            }

            //
            // Load the command list.

            addCmd(this.shellVer, "ver");
            addCmd(this.shellHelp, "help");
            addCmd(this.shellShutdown, "shutdown");
            addCmd(this.shellCls, "cls");
            addCmd(this.shellMan, "man");
            addCmd(this.shellTrace, "trace");
            addCmd(this.shellRot13, "rot13");
            addCmd(this.shellPrompt, "prompt");
            addCmd(this.shellDate, "date");
            addCmd(this.shellWhereAmI, "whereami");
            addCmd(this.shellOracle, "oracle");
            addCmd(this.shellStatus, "status");
            addCmd(this.shellCrash, "crash");
            addCmd(this.shellLoad, "load");
            addCmd(this.shellRun, "run");
            addCmd(this.shellProcesses, "ps");
            addCmd(this.shellKill, "kill");
            addCmd(this.shellClearMem, "clearmem");
            addCmd(this.shellRunAll, "runall");
            addCmd(this.shellKillAll, "killall");
            addCmd(this.shellQuantum, "quantum");

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public static putUsage(topic: string) {
            if(ShellCommand.information[topic].usage != "") {
                _StdOut.putLine("Usage: " + topic + " " +
                    ShellCommand.information[topic].usage + ".");
            } else {
                _StdOut.putLine("Usage: " + topic + ".");
            }
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, declare invalid command
                this.execute(this.shellInvalidCommand);
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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
        }

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        public predictInput(buffer: string): string[] {
            var predictions = [];

            //iterate through the command list and try to find a match for buffer
            for(var i in this.commandList) {
                var sc = this.commandList[i];
                if(sc.command.startsWith(buffer)) {
                    predictions[predictions.length] = sc.command;
                }
            }

            return predictions;
        }

        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putLine("Invalid Command. ");
            _StdOut.putText("Type 'help' for, well... help.");
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                var cmdStr = _OsShell.commandList[i].command;
                var cmdInfo = ShellCommand.information[cmdStr];

                if(!cmdInfo) {
                    var cmdInfo = {
                        help : "No description provided."
                    };
                }
                _StdOut.advanceLine();
                _StdOut.putText("  " + cmdStr +
                                " - " + cmdInfo.help);
            }
        }

        public shellShutdown(args: string[]) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "yostos":
                        _StdOut.putText("YostOS is a browser-based virtual operating system." +
                            "It's written in typescript and based on Alan Labouseur's " + 
                            "TSOS-2019 template. Despite its flaws, it is indisputably " +
                            "better than Windows Vista.");
                        break;

                    default:
                        var info = ShellCommand.information[topic];
                        if(info) {
                            Shell.putUsage(topic);
                            _StdOut.putLine(info.manual);

                        } else {
                            _StdOut.putText("No manual entry for " +
                                            topic + ".");
                        }
                        break;
                }
            } else {
                Shell.putUsage("man");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        _Trace = true;
                        _StdOut.putText("Trace ON");
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                Shell.putUsage("trace");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                Shell.putUsage("rot13");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                Shell.putUsage("prompt");
            }
        }

        public shellDate(args: string[]) {
            //JS comes with a built-in date object that displays the current date, so we just use that.
            var d = new Date();
            _StdOut.putText(d.toString());
        }

        public shellWhereAmI(args: string[]) {
            //HTML5 has a handy geolocation function to find lat/lng.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    _StdOut.putText("Here is your current...");
                    _StdOut.advanceLine();
                    _StdOut.putText("  Latitude: " + pos.coords.latitude);
                    _StdOut.advanceLine();
                    _StdOut.putText("  Longitude: " + pos.coords.longitude);
                    _StdOut.advanceLine();
                });
            } else { 
                _StdOut.putText("Your browser does not support geolocation.");
            }
        }

        public shellOracle(args: string[]) {
            //don't tell anyone, but the oracle is actually not sacred or anything.
            //it just picks some words from your input sentence and tries to make a randomized sentence
            //using some predefined adjectives and verbs.
            if(args.length > 0) {
                var randMax = (max) => {
                    return Math.floor(max * Math.random());
                }

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
            } else {
                _StdOut.putText("[ORACLE] Hurry up and ask a question; I'm very busy today.");
            }
        }

        public shellStatus(args: string[]) {
            if(args.length > 0) {
                var statusElem = document.getElementById("divStatus");

                if(statusElem) {
                    var statusStr = "";

                    for (var a in args) {
                        statusStr = statusStr + " " + args[a];
                    }

                    statusStr = statusStr.slice(1);

                    statusElem.innerHTML = statusStr;

                    _StdOut.putText("Changed Status to '" + statusStr + "'");               
                }

            } else {
                Shell.putUsage("status");
            }
        }

        public shellCrash(args: string[]) {
            if(args.length > 0) {
                var crashMsg = "";

                for (var a in args) {
                    crashMsg = crashMsg + " " + args[a];
                }

                crashMsg = crashMsg.slice(1);

                _Kernel.krnTrapError(crashMsg);
            } else {
                _Kernel.krnTrapError("No error message provided.");
            }
        }

        public shellLoad(args: string[]) {
            var inputElem = <HTMLInputElement> 
                document.getElementById("taProgramInput");

            var inputStr = inputElem.value;

            //ensure program input has something in it.
            if(inputStr == "") {
                _StdOut.putText("ERROR - Program Input is empty. " + 
                               "Load failed.");
                return;
            }

            var hexList = new Array<number>();
            var hexStrBuf = "";

            for(var i = 0; i < inputStr.length; i++) {

                //every hex number must contain only 0-9, a-f, or A-F
                if(inputStr[i].match(/[a-fA-F0-9]/g)) {
                    hexStrBuf += inputStr[i];

                //anything except whitespace throws an error
                } else if(!inputStr[i].match(/\s/)) {
                    _StdOut.putText("ERROR - Unrecognized symbol '" +
                                    inputStr[i] + "' at position " + i +
                                    ". Load failed.");
                    return;
                }

                // every hex number must be 2 digits
                if(hexStrBuf.length == 2){
                    hexList[hexList.length] = parseInt(hexStrBuf, 16);
                    hexStrBuf = "";
                } 
            }

            //if there's anything left in the buffer, warn the user
            if(hexStrBuf != "") {
                _StdOut.putText("WARNING - Dangling character: '" + 
                                hexStrBuf + "' is not used. ");
            }

            //create a PCB for the new program
            var pcb = new PCB();
            _ProcessList[pcb.processID] = pcb;

            //store loaded input in memory
            _MemoryManager.usePCBSegment(pcb);
            if(!_MemoryManager.setArray(0, hexList)) {
                return;
            }

            _StdOut.putLine("Load successful. Assigned PID " + 
                            pcb.processID + ".");
            _StdOut.putLine("You can now run this program via:");
            _StdOut.putLine("  run " + pcb.processID);

            Control.hostUpdateProcessTable();
        }

        public shellRun(args: string[]) {
            if(args.length > 0) {
                var pid = parseInt(args[0]);

                if(_ProcessList[pid]) {
                    _KernelScheduler.scheduleProcess(_ProcessList[pid]);

                    Control.hostUpdateProcessTable();
                } else {
                    _StdOut.putLine("ERROR - PCB for Process ID " + pid +
                                    " is undefined.");
                }
            } else {
                Shell.putUsage("run");
            }
        }

        public shellProcesses(args: string[]) {
            for(var i in _ProcessList) {
                var p = _ProcessList[i];
                _StdOut.putLine(
                    "Process " + p.processID + ": " +
                    ProcessStrings[p.processState]);
            }
        }

        public shellKill(args: string[]) {
            if(args.length > 0) {
                var pid = parseInt(args[0]);
                _KernelDispatcher.stopProcess(_ProcessList[pid]);
                Control.hostUpdateProcessTable();
            } else {
                Shell.putUsage("kill");
            }
        }

        public shellClearMem(args: string[]) {
            for(var i = 0; i < MEM_SEGMENT_COUNT; i++) {
                _MemoryManager.useAllMemory();
                _MemoryManager.clearArray();
            }
        }

        public shellRunAll(args: string[]) {
            for(var i in _ProcessList) {
                _OsShell.shellRun([""+_ProcessList[i].processID]);
            }
        }

        public shellKillAll(args: string[]) {
            for(var i in _ProcessList) {
                _OsShell.shellKill([""+_ProcessList[i].processID]);
            }
        }

        public shellQuantum(args: string[]) {
            if(args.length > 0) {
                _KernelScheduler.quantum = parseInt(args[0]);
            } else {
                Shell.putUsage("quantum");
            }
        }
    }
}
