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
        public currentPCBIndex: number = null;

        public getNextRunnableProcess() {
            //if there's no current process, return the first one
            if(this.currentPCBIndex == null) {
                for(var i = 0; i < _ProcessList.length; i++) {
                    if(_ProcessList[i].processState ==
                        ProcessState.READY) {
                        console.log(i);
                        return i;
                    }
               }

            //otherwise, look for the next one
            } else {
                var take_next = false;

                var inc = function(v: number, c: number) {
                    return (v+1 < c) ? v+1 : 0;
                }

                var i = inc(this.currentPCBIndex, _ProcessList.length);
                var loops = 2;

                while(loops > 0) {
                    if(_ProcessList[i].processState ==
                        ProcessState.READY) {
                        return i;
                    }

                    i = inc(i, _ProcessList.length);
                    if(i == 0) loops--;
                }
            }

            return this.currentPCBIndex;
        }

        public scheduleProcess(pcb: PCB) {
            pcb.processState = ProcessState.READY;

            _Kernel.krnTrace("Process " + pcb.processID + " scheduled");
        }

        public cycle() {
            this.cycleCount++;

            //perform round robin context switching
            if(this.cycleCount > this.quantum) {
                var next_pcb_i = this.getNextRunnableProcess();

                //if there is a next process, perform a context switch
                if(this.currentPCBIndex != next_pcb_i) {
                    _KernelInterruptQueue.enqueue(
                        new Interrupt(
                            CONTEXT_SWITCH_IRQ,
                            [_ProcessList[this.currentPCBIndex],
                            _ProcessList[next_pcb_i]]));

                    this.currentPCBIndex = next_pcb_i;

                    _Kernel.krnTrace("Context switch scheduled");    
                }                
                
                this.cycleCount = 0;
            }
        }
    }
}
