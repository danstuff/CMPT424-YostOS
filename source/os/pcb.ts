/* ------------
   pcb.ts

    Prototype for a Process Control Block  

   ------------ */

module TSOS {
    enum ProcessState {
        PROCESS_STATE_IDLE,
        PROCESS_STATE_MAX
    };

    export class PCB {
        // Properties
        public processID;

        public processState = PROCESS_STATE_IDLE;
        public programCounter = 0;

        public registers = [];          //list of CPU registers

        public parentID;                //parent process identifier
        public childIDs = [];           //list of process children

        public memorySector = [0, 0];   //minimum and maxiumum address

        constructor(_processID: number) {
            this.processID = _processID;
        }   
    }
}
