/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Scheduler {
        public quantum: number = 6;
        public cycleCount: number = 0;

        public scheduleProcess(pcb: PCB) {
            pcb.processState = ProcessState.READY;

            _Kernel.krnTrace("Process " + pcb.processID + " scheduled");
        }

        public cycle() {
            this.cycleCount++;

            //perform round robin context switching
            if(this.cycleCount > this.quantum) {
                var cur_pcb: PCB = null;
                var next_pcb: PCB = null;

                var i = 0;

                while(next_pcb == null) {

                    //search for the current process, 
                    if(_ProcessList[i].processID == _CPU.PID) {
                        if(cur_pcb) {
                            next_pcb = cur_pcb;
                        } else {
                            cur_pcb = _ProcessList[i];
                        }

                    //then the next ready process
                    } else if(cur_pcb && 
                              _ProcessList[i].processState ==
                              ProcessState.READY) {
                        next_pcb = _ProcessList[i];
                    }

                    //increment and loop back to 0
                    i++;
                    if(i >= _ProcessList.length) i = 0;
                }

                //if there is a next process, perform a context switch
                if(cur_pcb && next_pcb && cur_pcb != next_pcb) {
                    _KernelInterruptQueue.enqueue(
                        new Interrupt(
                            CONTEXT_SWITCH_IRQ,
                            [cur_pcb, next_pcb]));

                    _Kernel.krnTrace("Context switch scheduled");    
                }                
                
                this.cycleCount = 0;
            }
        }
    }
}
