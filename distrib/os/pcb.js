/* ------------
   pcb.ts

    Prototype for a Process Control Block

   ------------ */
var TSOS;
(function (TSOS) {
    var ProcessState;
    (function (ProcessState) {
        ProcessState[ProcessState["LOADED"] = 0] = "LOADED";
        ProcessState[ProcessState["READY"] = 1] = "READY";
        ProcessState[ProcessState["RUNNING"] = 2] = "RUNNING";
        ProcessState[ProcessState["STOPPED"] = 3] = "STOPPED";
        ProcessState[ProcessState["DONE"] = 4] = "DONE";
        ProcessState[ProcessState["MAX"] = 5] = "MAX";
    })(ProcessState = TSOS.ProcessState || (TSOS.ProcessState = {}));
    TSOS.ProcessStrings = [
        "loaded",
        "ready",
        "running",
        "stopped",
        "done"
    ];
    var PCB = /** @class */ (function () {
        function PCB() {
            this.programCounter = 0;
            this.instructionReg = 0;
            this.accumulator = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = false;
            this.processPriority = 0;
            this.processState = ProcessState.STOPPED;
            this.processBase = 0;
            this.processLimit = TSOS.MEM_SEGMENT_SIZE - 1;
            // sequential PID
            this.processID = PCB.nextID++;
            this.processBase = PCB.nextBase;
            this.processLimit = this.processBase + TSOS.MEM_SEGMENT_SIZE - 1;
            PCB.nextBase = this.processLimit + 1;
        }
        // Static properties
        PCB.nextID = 0;
        PCB.nextBase = 0;
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
