/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    var Control = /** @class */ (function () {
        function Control() {
        }
        Control.toHexStr = function (value, digits) {
            if (digits === void 0) { digits = 2; }
            //return a formatted hex string.
            var str = value.toString(16);
            for (var i = str.length; i < digits; i++) {
                str = "0" + str;
            }
            return str;
        };
        Control.hostInit = function () {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
            // Initialize CPU and memory objects
            _CPU = new TSOS.Cpu();
            _CPU.init();
            _Memory = new TSOS.Memory();
            _Memory.init();
            _MemoryAccessor = new TSOS.MemoryAccessor();
        };
        Control.hostLog = function (msg, source) {
            if (source === void 0) { source = "?"; }
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clk:" + clock + ", src:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            // Insert a new row into the host log table.
            var taLog = document.
                getElementById("taHostLog");
            var taRow = taLog.insertRow(0);
            var taCell = taRow.insertCell(0);
            taCell.colSpan = 3;
            taCell.innerHTML = str;
            // Update the Host Log header with the current date and time
            document.getElementById("divDateTime").innerHTML =
                new Date().toLocaleString();
            // TODO in the future: Optionally update a log database or some streaming service.
        };
        Control.hostSetTable = function (tableID, tableData) {
            var taBody = document
                .getElementById(tableID);
            var taBodyNew = document.createElement("tbody");
            taBodyNew.id = tableID;
            //populate the new table body with data
            for (var i in tableData) {
                var taRow = taBodyNew.insertRow(-1);
                for (var j in tableData[i]) {
                    var taCell = taRow.insertCell(-1);
                    taCell.innerHTML = tableData[i][j];
                }
            }
            //replace the old body with the new one
            taBody.parentNode.replaceChild(taBodyNew, taBody);
        };
        Control.hostUpdateMemoryTable = function () {
            var start = 0;
            var end = TSOS.MEMORY_SIZE - 1;
            var rowlen = 8;
            //create array to store the rows of the table
            var tableRows = new Array();
            //iterate over all the rows
            var rownum = Math.ceil((end - start) / rowlen);
            for (var i = 0; i < rownum; i++) {
                //create a new row and prepend it with row address
                var tableRow = new Array();
                tableRow[tableRow.length] = "0x" +
                    Control.toHexStr(i * rowlen, 3);
                //add values to the row in descending order
                for (var j = 1; j <= rowlen; j++) {
                    tableRow[j] = Control.toHexStr(_MemoryAccessor.
                        getValue((i * rowlen) + j - 1));
                }
                tableRows[i] = tableRow;
            }
            Control.hostSetTable("taMemory", tableRows);
        };
        Control.hostUpdateProcessTable = function () {
            //update process table log
            var pcbTable = new Array();
            for (var i in _ProcessList) {
                pcbTable[i] = new Array();
                var pcb = _ProcessList[i];
                pcbTable[i][0] = Control.toHexStr(pcb.processID);
                pcbTable[i][1] = Control.toHexStr(pcb.programCounter);
                pcbTable[i][2] = Control.toHexStr(pcb.instructionReg);
                pcbTable[i][3] = Control.toHexStr(pcb.accumulator);
                pcbTable[i][4] = Control.toHexStr(pcb.Xreg);
                pcbTable[i][5] = Control.toHexStr(pcb.Yreg);
                pcbTable[i][6] = Control.toHexStr(pcb.Zflag);
                pcbTable[i][7] = Control.toHexStr(pcb.processPriority);
                pcbTable[i][8] = Control.toHexStr(pcb.processState);
                pcbTable[i][9] = Control.toHexStr(pcb.processLocation);
            }
            Control.hostSetTable("taProcesses", pcbTable);
        };
        //
        // Host Events
        //
        Control.hostBtnStartOS_click = function (btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        };
        Control.hostBtnHaltOS_click = function (btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        };
        Control.hostBtnReset_click = function (btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            // UPDATE: according to https://developer.mozilla.org/en-US/docs/Web/API/Location/reload, there is no official support for a boolean parameter for location.reload. Because it causes an error in some versions of typescript, I have decided to remove it.
            //location.reload(true);
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        };
        return Control;
    }());
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
