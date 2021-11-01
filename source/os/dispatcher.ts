/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Dispatcher {
        //take a PCB, set it to run, and copy its data to the CPU state
        public startProcess(pcb: PCB) {
            pcb.processState = ProcessState.RUNNING;
            _MemoryManager.usePCBSegment(pcb);

            _CPU.PC = pcb.programCounter;
            _CPU.Acc = pcb.accumulator;
            _CPU.Xreg = pcb.Xreg;
            _CPU.Yreg = pcb.Yreg;
            _CPU.Zflag = pcb.Zflag;
            _CPU.isExecuting = true;
            _CPU.PID = pcb.processID;
        }

        public syncProcess(pcb: PCB) {
            //if PIDs match, this is the current process.
            //Sync it with CPU state.
            if(_CPU.PID == pcb.processID) {
                pcb.programCounter = _CPU.PC; 
                pcb.accumulator = _CPU.Acc;
                pcb.Xreg = _CPU.Xreg;
                pcb.Yreg = _CPU.Yreg;
                pcb.Zflag = _CPU.Zflag;

                //adjust process state based on whether or not CPU running
                if(_CPU.isExecuting) {
                    pcb.processState = ProcessState.RUNNING;
                } else {
                    pcb.processState = ProcessState.DONE;
                    Control.hostUpdateProcessTable();
                }
            }
        }

        public stopProcess(pcb: PCB) {
            if(pcb.processID == _CPU.PID) {
                _CPU.isExecuting = false;
            }

            pcb.processState = ProcessState.STOPPED;
        }

        public endProcess(pcb: PCB) {
            if(pcb.processID == _CPU.PID) {
                _CPU.isExecuting = false;
            }

            pcb.processState = ProcessState.DONE;
        }

        public switchProcess(pcb0: PCB, pcb1: PCB) {
            pcb0.processState = ProcessState.READY;
            this.startProcess(pcb1);
        }
    }
}
