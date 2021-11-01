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

        public scheduleProcess(pcb: PCB) {
            pcb.processState = ProcessState.READY;

            if(!_CPU.isExecuting) {
                this.startProcess(pcb);
            }
        }

        public cycle() {
            //update the process list with the CPU status
            for(var i in _ProcessList) {
                this.syncProcess(_ProcessList[i]);
            }

            //perform round robin context switching
            this.cycleCount++;
            
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
                    
                        this.switchProcess(cur_process, _ProcessList[i]);
                        use_next = false;
                        break;
                    }
                }

                //if there was no next process, loop back to 0
                if(use_next && _ProcessList[0].processState ==
                    ProcessState.READY) {
                    this.switchProcess(cur_process, _ProcessList[0]);
                }                
                
                Control.hostUpdateProcessTable();
                
                this.cycleCount = 0;
            }
        }
    }
}
