/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Dispatcher = /** @class */ (function () {
        function Dispatcher() {
        }
        //take a PCB, set it to run, and copy its data to the CPU state
        Dispatcher.prototype.startProcess = function (pcb) {
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
        Dispatcher.prototype.syncProcess = function (pcb) {
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
        Dispatcher.prototype.stopProcess = function (pcb) {
            if (pcb.processID == _CPU.PID) {
                _CPU.isExecuting = false;
            }
            pcb.processState = TSOS.ProcessState.STOPPED;
        };
        Dispatcher.prototype.endProcess = function (pcb) {
            if (pcb.processID == _CPU.PID) {
                _CPU.isExecuting = false;
            }
            pcb.processState = TSOS.ProcessState.DONE;
        };
        Dispatcher.prototype.switchProcess = function (pcb0, pcb1) {
            pcb0.processState = TSOS.ProcessState.READY;
            this.startProcess(pcb1);
        };
        return Dispatcher;
    }());
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
