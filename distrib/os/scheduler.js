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
            this.currentPCBIndex = null;
        }
        Scheduler.prototype.getNextRunnableProcess = function () {
            //if there's no current process, return the first one
            if (this.currentPCBIndex == null) {
                for (var i = 0; i < _ProcessList.length; i++) {
                    if (_ProcessList[i].processState ==
                        TSOS.ProcessState.READY) {
                        console.log(i);
                        return i;
                    }
                }
                //otherwise, look for the next one
            }
            else {
                var take_next = false;
                var inc = function (v, c) {
                    return (v + 1 < c) ? v + 1 : 0;
                };
                var i = inc(this.currentPCBIndex, _ProcessList.length);
                var loops = 2;
                while (loops > 0) {
                    if (_ProcessList[i].processState ==
                        TSOS.ProcessState.READY) {
                        return i;
                    }
                    i = inc(i, _ProcessList.length);
                    if (i == 0)
                        loops--;
                }
            }
            return this.currentPCBIndex;
        };
        Scheduler.prototype.scheduleProcess = function (pcb) {
            pcb.processState = TSOS.ProcessState.READY;
            _Kernel.krnTrace("Process " + pcb.processID + " scheduled");
        };
        Scheduler.prototype.cycle = function () {
            this.cycleCount++;
            //perform round robin context switching
            if (this.cycleCount > this.quantum) {
                var next_pcb_i = this.getNextRunnableProcess();
                //if there is a next process, perform a context switch
                if (this.currentPCBIndex != next_pcb_i) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_ProcessList[this.currentPCBIndex],
                        _ProcessList[next_pcb_i]]));
                    this.currentPCBIndex = next_pcb_i;
                    _Kernel.krnTrace("Context switch scheduled");
                }
                this.cycleCount = 0;
            }
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
