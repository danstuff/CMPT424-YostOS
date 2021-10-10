/* ------------
   pcb.ts

    Prototype for a Process Control Block  

   ------------ */

module TSOS {
    enum ProcessState {
        PROCESS_STATE_IDLE,
        PROCESS_STATE_RUNNING,
        PROCESS_STATE_MAX
    }

    export class PCB {
        // Static properties
        public static lastID = 0;

        // Properties
        public processID;

        public programCounter = 0;
        public instructionReg = 0;
        public accumulator = 0;

        public Xreg = 0;
        public Yreg = 0;
        public Zflag = 0;

        public processPriority = 0;
        public processState = ProcessState.PROCESS_STATE_IDLE;
        public processLocation = 0;

        constructor() {
            // sequential PID
            this.processID = PCB.lastID++;
        }   
    }
}
