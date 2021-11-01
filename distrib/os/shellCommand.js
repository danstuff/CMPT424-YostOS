var TSOS;
(function (TSOS) {
    var ShellCommand = /** @class */ (function () {
        function ShellCommand(func, command) {
            if (command === void 0) { command = ""; }
            this.func = func;
            this.command = command;
        }
        ShellCommand.information = {
            "ver": {
                usage: "",
                help: "Displays the current version data.",
                manual: "Ver displays the operating system name and current version."
            },
            "help": {
                usage: "",
                help: "This is the help command. Seek help.",
                manual: "Help displays a list of (hopefully) valid commands."
            },
            "shutdown": {
                usage: "",
                help: "Shuts down the virtual OS but leaves the underlying host / hardware simulation running.",
                manual: "Shutdown deactivates the OS but leaves the virtual hardware running."
            },
            "cls": {
                usage: "",
                help: "Clears the screen and resets the cursor position.",
                manual: "Cls clears the screen and resets the cursor to position zero."
            },
            "man": {
                usage: "<topic>",
                help: "Displays the MANual page for <topic>.",
                manual: "Man displays detailed information about a specific topic or command."
            },
            "trace": {
                usage: "<on | off>",
                help: "Turns the OS trace on or off.",
                manual: "Trace turns the OS trace in the Host Log on or off."
            },
            "rot13": {
                usage: "<string>",
                help: "Does rot13 obfuscation on <string>.",
                manual: "Rot13 performs ceaser-cipher-style rot13 encryption on <string>."
            },
            "prompt": {
                usage: "<string>",
                help: "Sets the prompt.",
                manual: "Prompt sets the prompt that appears before any text you enter. Default is '>'"
            },
            "date": {
                usage: "",
                help: "Displays the current date and time.",
                manual: "Date displays the current date and time according to a JS Date object."
            },
            "whereami": {
                usage: "",
                help: "Displays your approximate location.",
                manual: "Whereami shows your current latitude and longitude using the HTML5 geolocation system."
            },
            "oracle": {
                usage: "<string>",
                help: "Consult the sacred oracle with any question.",
                manual: "Oracle allows you to ask a holy oracle (definitely not RNG) for the answer to your life's toughest questions."
            },
            "status": {
                usage: "<string>",
                help: "Change the Host Log status message.",
                manual: "Status changes the message that appears above the host log window."
            },
            "crash": {
                usage: "<string>",
                help: "Cause a crash with an error message.",
                manual: "Crash allows you to immediately crash the OS with an error message."
            },
            "load": {
                usage: "",
                help: "Load and validate the User Program Input.",
                manual: "Load validates and processes assembly from the User Program Input, then places it in memory and assigns a PCB. All code must be in the form of 2-digit hex values."
            },
            "run": {
                usage: "<pid>",
                help: "Execute the program at <pid>.",
                manual: "Execute the program at the desired Process ID (PID).  Programs must first be loaded from the User Program Input using load."
            },
            "ps": {
                usage: "",
                help: "list the running processes and their PIDs.",
                manual: "ps lists all the currently running processes in the console with their process IDs (PIDs)."
            },
            "kill": {
                usage: "<pid>",
                help: " kills the specified process ID (PID).",
                manual: "Immediately terminate the process at the desired process ID (PID)."
            },
            "clearmem": {
                usage: "",
                help: " clear all memory partitions.",
                manual: "Reset all values in all memory partitions to 0."
            },
            "runall": {
                usage: "",
                help: " run all loaded programs.",
                manual: "Execute all programs stored in memory simultaneously."
            },
            "killall": {
                usage: "",
                help: " kill all running processes.",
                manual: "Immediately terminate every process that is currently running or ready."
            },
            "quantum": {
                usage: "<int>",
                help: " set the Round Robin quantum.",
                manual: "Set the number of CPU cycles used for the Round Robin quantum."
            }
        };
        return ShellCommand;
    }());
    TSOS.ShellCommand = ShellCommand;
})(TSOS || (TSOS = {}));
