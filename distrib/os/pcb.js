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
        function PCB() {
            this.programCounter = 1;
            this.instructionReg = 2;
            this.accumulator = 3;
            this.Xreg = 4;
            this.Yreg = 5;
            this.Zflag = 6;
            this.processPriority = 7;
            this.processState = ProcessState.PROCESS_STATE_IDLE;
            this.processLocation = 8;
            // sequential PID
            this.processID = PCB.lastID++;
        }
        // Static properties
        PCB.lastID = 0;
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
