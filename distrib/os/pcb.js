/* ------------
   pcb.ts

    Prototype for a Process Control Block

   ------------ */
var TSOS;
(function (TSOS) {
    var ProcessState;
    (function (ProcessState) {
        ProcessState[ProcessState["PROCESS_STATE_IDLE"] = 0] = "PROCESS_STATE_IDLE";
        ProcessState[ProcessState["PROCESS_STATE_MAX"] = 1] = "PROCESS_STATE_MAX";
    })(ProcessState || (ProcessState = {}));
    ;
    var PCB = /** @class */ (function () {
        function PCB(_processID) {
            this.processState = ProcessState.PROCESS_STATE_IDLE;
            this.programCounter = 0;
            this.registers = []; //list of CPU registers
            this.childIDs = []; //list of process children
            this.memorySector = [0, 0]; //minimum and maxiumum address
            this.processID = _processID;
        }
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
