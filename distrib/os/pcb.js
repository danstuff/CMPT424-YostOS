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
    ;
    var PCB = /** @class */ (function () {
        function PCB() {
            this.processState = ProcessState.PROCESS_STATE_IDLE;
            this.programCounter = 0;
            this.registers = []; //list of CPU registers
            this.childIDs = []; //list of process children
            //minimum and maxiumum address
            this.memorySector = [0, TSOS.MEMORY_SIZE];
            //generate a random number for PID
            //this has a 1 in 4 billion chance of colliding
            //with another PID. So I guess it could happen.
            //but probably not. hopefully.
            var numArray = new Uint32Array(1);
            window.crypto.getRandomValues(numArray);
            this.processID = numArray[0];
        }
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
