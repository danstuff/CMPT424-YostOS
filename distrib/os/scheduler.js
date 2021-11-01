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
        //take a PCB, set it to run, and copy its data to the CPU state
        Scheduler.prototype.startProcess = function (pcb) {
            pcb.processState = TSOS.ProcessState.RUNNING;
            _MemoryManager.usePCBSegment(pcb);
            _CPU.PC = pcb.programCounter;
            _CPU.Acc = pcb.accumulator;
            _CPU.Xreg = pcb.Xreg;
            _CPU.Yreg = pcb.Yreg;
            _CPU.Zflag = pcb.Zflag;
            _CPU.isExecuting = true;
            _CPU.PID = pcb.processID;
        };
        Scheduler.prototype.syncProcess = function (pcb) {
            //if PIDs match, this is the current process.
            //Sync it with CPU state.
            if (_CPU.PID == pcb.processID) {
                pcb.programCounter = _CPU.PC;
                pcb.accumulator = _CPU.Acc;
                pcb.Xreg = _CPU.Xreg;
                pcb.Yreg = _CPU.Yreg;
                pcb.Zflag = _CPU.Zflag;
                //adjust process state based on whether or not CPU running
                if (_CPU.isExecuting) {
                    pcb.processState = TSOS.ProcessState.RUNNING;
                }
                else {
                    pcb.processState = TSOS.ProcessState.DONE;
                    TSOS.Control.hostUpdateProcessTable();
                }
            }
        };
        Scheduler.prototype.stopProcess = function (pcb) {
            if (pcb.processID == _CPU.PID) {
                _CPU.isExecuting = false;
            }
            pcb.processState = TSOS.ProcessState.STOPPED;
        };
        Scheduler.prototype.endProcess = function (pcb) {
            if (pcb.processID == _CPU.PID) {
                _CPU.isExecuting = false;
            }
            pcb.processState = TSOS.ProcessState.DONE;
        };
        Scheduler.prototype.switchProcess = function (pcb0, pcb1) {
            pcb0.processState = TSOS.ProcessState.READY;
            this.startProcess(pcb1);
        };
        Scheduler.prototype.scheduleProcess = function (pcb) {
            pcb.processState = TSOS.ProcessState.READY;
            if (!_CPU.isExecuting) {
                this.startProcess(pcb);
            }
        };
        Scheduler.prototype.cycle = function () {
            //update the process list with the CPU status
            for (var i in _ProcessList) {
                this.syncProcess(_ProcessList[i]);
            }
            //perform round robin context switching
            this.cycleCount++;
            if (this.cycleCount > this.quantum) {
                var use_next = false;
                var cur_process = null;
                //search for the current process, set a flag when found
                for (var i in _ProcessList) {
                    if (_ProcessList[i].processID == _CPU.PID) {
                        cur_process = _ProcessList[i];
                        use_next = true;
                        //if the flag was set, switch to the next ready process
                    }
                    else if (use_next &&
                        _ProcessList[i].processState ==
                            TSOS.ProcessState.READY) {
                        this.switchProcess(cur_process, _ProcessList[i]);
                        use_next = false;
                        break;
                    }
                }
                //if there was no next process, loop back to 0
                if (use_next && _ProcessList[0].processState ==
                    TSOS.ProcessState.READY) {
                    this.switchProcess(cur_process, _ProcessList[0]);
                }
                TSOS.Control.hostUpdateProcessTable();
                this.cycleCount = 0;
            }
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
