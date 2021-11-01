/* ------------
   pcb.ts

    Prototype for a Process Control Block  

   ------------ */

module TSOS {
    export enum ProcessState {
        LOADED,
        READY,
        RUNNING,
        STOPPED,
        DONE,
        MAX
    }

    export const ProcessStrings: Array<string> = [
        "loaded",
        "ready",
        "running",
        "stopped",
        "done"
    ]

    export class PCB {
        // Static properties
        public static nextID = 0;
        public static nextBase = 0;

        // Properties
        public processID;

        public programCounter = 0;
        public instructionReg = 0;
        public accumulator = 0;

        public Xreg = 0;
        public Yreg = 0;
        public Zflag = false;

        public processPriority = 0;
        public processState = ProcessState.STOPPED;

        public processBase = 0;
        public processLimit = MEM_SEGMENT_SIZE-1;

        constructor() {
            // sequential PID
            this.processID = PCB.nextID++;
            this.processBase = PCB.nextBase;
            this.processLimit = this.processBase+MEM_SEGMENT_SIZE-1;
            PCB.nextBase = this.processLimit+1;
        }   
    }
}
