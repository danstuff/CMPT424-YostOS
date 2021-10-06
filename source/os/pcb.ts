/* ------------
   pcb.ts

    Prototype for a Process Control Block  

   ------------ */

module TSOS {
    enum ProcessState {
        PROCESS_STATE_IDLE,
        PROCESS_STATE_RUNNING,
        PROCESS_STATE_MAX
    };

    export class PCB {
        // Properties
        public processID;

        public processState = ProcessState.PROCESS_STATE_IDLE;
        public programCounter = 0;

        public registers = [];          //list of CPU registers

        public parentID;                //parent process identifier
        public childIDs = [];           //list of process children

        //minimum and maxiumum address
        public memorySector = [0, MEMORY_SIZE];

        constructor() {
            //generate a random number for PID
            //this has a 1 in 4 billion chance of colliding
            //with another PID. So I guess it could happen.
            //but probably not. hopefully.
            var numArray = new Uint32Array(1);
            window.crypto.getRandomValues(numArray);
            this.processID = numArray[0];
        }   
    }
}
