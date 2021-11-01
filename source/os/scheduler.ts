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
        }

        public cycle() {
            this.cycleCount++;

            //perform round robin context switching
            if(this.cycleCount > this.quantum) {
                var use_next = false;
                var cur_process: PCB = null;

                //search for the current process, set a flag when found
                for(var i in _ProcessList) {
                    if(_ProcessList[i].processID == _CPU.PID) {
                        cur_process = _ProcessList[i];
                        use_next = true;

                    //if the flag was set, switch to the next ready process
                    } else if(use_next && 
                              _ProcessList[i].processState ==
                              ProcessState.READY) {
                    
                        _KernelInterruptQueue.enqueue(
                            new Interrupt(
                                CONTEXT_SWITCH_IRQ,
                                [cur_process, _ProcessList[i]));

                        use_next = false;
                        break;
                    }
                }

                //if there was no next process, loop back to 0
                if(use_next && _ProcessList[0].processState ==
                    ProcessState.READY) {
                        _KernelInterruptQueue.enqueue(
                            new Interrupt(
                                CONTEXT_SWITCH_IRQ,
                                [cur_process, _ProcessList[0]));
                }                
                
                this.cycleCount = 0;
            }
        }
    }
}
