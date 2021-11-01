/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
            this.quantum = 6;
            this.cycleCount = 0;
        }
        Scheduler.prototype.scheduleProcess = function (pcb) {
            pcb.processState = TSOS.ProcessState.READY;
        };
        Scheduler.prototype.cycle = function () {
            this.cycleCount++;
            //perform round robin context switching
            if (this.cycleCount > this.quantum) {
                var cur_pcb = null;
                var next_pcb = null;
                var i = 0;
                while (next_pcb == null) {
                    //search for the current process, 
                    if (_ProcessList[i].processID == _CPU.PID) {
                        if (cur_pcb) {
                            next_pcb = cur_pcb;
                        }
                        else {
                            cur_pcb = _ProcessList[i];
                        }
                        //then the next ready process
                    }
                    else if (cur_pcb &&
                        _ProcessList[i].processState ==
                            TSOS.ProcessState.READY) {
                        next_pcb = _ProcessList[i];
                    }
                    //increment and loop back to 0
                    i++;
                    if (i >= _ProcessList.length)
                        i = 0;
                }
                //if there was no next process, loop back to 0
                if (cur_pcb && cur_pcb != next_pcb) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [cur_pcb, next_pcb]));
                }
                this.cycleCount = 0;
            }
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
