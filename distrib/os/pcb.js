/* ------------
   pcb.ts

    Prototype for a Process Control Block

   ------------ */
var TSOS;
(function (TSOS) {
    var ProcessState;
    (function (ProcessState) {
        ProcessState[ProcessState["PROCESS_STATE_IDLE"] = 0] = "PROCESS_STATE_IDLE";
        ProcessState[ProcessState["PROCESS_STATE_RUNNING"] = 1] = "PROCESS_STATE_RUNNING";
        ProcessState[ProcessState["PROCESS_STATE_MAX"] = 2] = "PROCESS_STATE_MAX";
    })(ProcessState || (ProcessState = {}));
    var PCB = /** @class */ (function () {
        function PCB(_processLength) {
            this.programCounter = 0;
            this.instructionReg = 0;
            this.accumulator = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = false;
            this.processPriority = 0;
            this.processState = ProcessState.PROCESS_STATE_IDLE;
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
