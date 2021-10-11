/* ------------
   pcb.ts

    Prototype for a Process Control Block

   ------------ */
var TSOS;
(function (TSOS) {
    var ProcessState;
    (function (ProcessState) {
        ProcessState[ProcessState["STOPPED"] = 0] = "STOPPED";
        ProcessState[ProcessState["RUNNING"] = 1] = "RUNNING";
        ProcessState[ProcessState["DONE"] = 2] = "DONE";
        ProcessState[ProcessState["MAX"] = 3] = "MAX";
    })(ProcessState = TSOS.ProcessState || (TSOS.ProcessState = {}));
    var PCB = /** @class */ (function () {
        function PCB(_processLength) {
            this.programCounter = 0;
            this.instructionReg = 0;
            this.accumulator = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = false;
            this.processPriority = 0;
            this.processState = ProcessState.STOPPED;
            this.processLocation = 0;
            // sequential PID
            this.processID = PCB.lastID++;
            this.processLocation = PCB.lastLocation;
            PCB.lastLocation += _processLength;
        }
        // Static properties
        PCB.lastID = 0;
        PCB.lastLocation = 0;
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
