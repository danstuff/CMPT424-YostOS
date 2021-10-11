/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = /** @class */ (function () {
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting, PID) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = false; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (PID === void 0) { PID = 0; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.PID = PID;
        }
        //initialize CPU state
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = false;
            this.isExecuting = false;
            this.PID = 0;
        };
        //take a PCB, set it to run, and copy its data to the CPU state
        Cpu.prototype.startProcess = function (pcb) {
            pcb.processState = TSOS.ProcessState.RUNNING;
            pcb.programCounter = pcb.processLocation;
            this.PC = pcb.programCounter;
            this.Acc = pcb.accumulator;
            this.Xreg = pcb.Xreg;
            this.Yreg = pcb.Yreg;
            this.Zflag = pcb.Zflag;
            this.isExecuting = true;
            this.PID = pcb.processID;
        };
        Cpu.prototype.syncProcess = function (pcb) {
            //if PIDs match, this is the current process.
            //Sync it with CPU state.
            if (this.PID == pcb.processID) {
                pcb.programCounter = this.PC;
                pcb.accumulator = this.Acc;
                pcb.Xreg = this.Xreg;
                pcb.Yreg = this.Yreg;
                pcb.Zflag = this.Zflag;
                //adjust process state based on whether or not CPU running
                if (this.isExecuting) {
                    pcb.processState = TSOS.ProcessState.RUNNING;
                }
                else {
                    pcb.processState = TSOS.ProcessState.DONE;
                    TSOS.Control.hostUpdateProcessTable();
                }
                //all processes besides the current one should be stopped
            }
            else {
                pcb.processState = TSOS.ProcessState.STOPPED;
            }
        };
        Cpu.prototype.stopProcess = function (pcb) {
            this.isExecuting = false;
            pcb.processState = TSOS.ProcessState.STOPPED;
        };
        Cpu.prototype.endProcess = function (pcb) {
            this.isExecuting = false;
            pcb.processState = TSOS.ProcessState.DONE;
        };
        //advance the program counter and get the value at it's position
        Cpu.prototype.getNextConstant = function () {
            return _MemoryAccessor.getValue(++this.PC);
        };
        //advance PC and get next two bytes, which are an address
        Cpu.prototype.getNextMemory = function () {
            var addr0 = _MemoryAccessor.getValue(++this.PC);
            var addr1 = _MemoryAccessor.getValue(++this.PC);
            //assemble bytes in little endian
            var addr = addr0 + (addr1 * 0xFF);
            return _MemoryAccessor.getValue(addr);
        };
        //advance PC, get 2 bytes, and set the value at the address
        Cpu.prototype.setNextMemory = function (value) {
            var addr0 = _MemoryAccessor.getValue(++this.PC);
            var addr1 = _MemoryAccessor.getValue(++this.PC);
            //assemble bytes in little endian
            var addr = addr0 + (addr1 * 0xFF);
            return _MemoryAccessor.setValue(addr, value);
        };
        //same as getNextMemory except PC is not incremented
        Cpu.prototype.peekNextMemory = function () {
            var addr0 = _MemoryAccessor.getValue(this.PC + 1);
            var addr1 = _MemoryAccessor.getValue(this.PC + 2);
            //assemble bytes in little endian
            var addr = addr0 + (addr1 * 0xFF);
            return _MemoryAccessor.getValue(addr);
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            this.isExecuting = true;
            // TODO: Accumulate CPU usage and profiling statistics here.
            //load next instruction into the IR
            this.IR = _MemoryAccessor.getValue(this.PC);
            //perform action based on instruction
            switch (this.IR) {
                case 0xA9: //LDA (constant)
                    this.Acc = this.getNextConstant();
                    break;
                case 0xAD: //LDA (memory)
                    this.Acc = this.getNextMemory();
                    break;
                case 0x8D: //STA (memory)
                    this.setNextMemory(this.Acc);
                    break;
                case 0x6D: //ADC
                    this.Acc += this.getNextMemory();
                    break;
                case 0xA2: //LDX (constant)
                    this.Xreg = this.getNextConstant();
                    break;
                case 0xAE: //LDX (memory)
                    this.Xreg = this.getNextMemory();
                    break;
                case 0xA0: //LDY (constant)
                    this.Yreg = this.getNextConstant();
                    break;
                case 0xAC: //LDY (memory)
                    this.Yreg = this.getNextMemory();
                    break;
                case 0xEA: //NOP
                    break;
                case 0x00: //BRK
                    this.isExecuting = false;
                    break;
                case 0xEC: //CPX
                    var cmp_val = this.getNextMemory();
                    this.Zflag = (this.Xreg == cmp_val);
                    break;
                case 0xD0: //BNE
                    var hex = this.getNextConstant();
                    if (this.Zflag == false) {
                        //process signed values
                        if ((hex & 0x80) > 0) {
                            hex -= 0x100;
                        }
                        this.PC += hex;
                    }
                    break;
                case 0xEE: //INC
                    var val = this.peekNextMemory();
                    this.setNextMemory(++val);
                    break;
                case 0xFF: //SYS
                    //print single hex digit
                    if (this.Xreg == 0x01) {
                        _StdIn.putLine(TSOS.Control.toHexStr(this.Yreg));
                        //print 00-terminated string
                    }
                    else if (this.Xreg == 0x02) {
                        var strOut = "";
                        var char_addr = this.Yreg;
                        var char_val = 0;
                        do {
                            char_val = _MemoryAccessor.getValue(char_addr);
                            char_addr++;
                            strOut += String.fromCharCode(char_val);
                        } while (char_val != 0 && char_addr < TSOS.MEMORY_SIZE);
                        _StdIn.putLine(strOut);
                    }
                    break;
                default:
                    //unknown instruction, post error and stop
                    _StdIn.putLine("ERROR - Unknown instruction: " +
                        TSOS.Control.toHexStr(this.IR));
                    this.isExecuting = false;
                    break;
            }
            this.PC++;
        };
        //op codes, their mnemonics, and a description
        Cpu.instructions = {
            0xA9: {
                mnemonic: "LDA",
                description: "Load the accumulator with a constant."
            },
            0xAD: {
                mnemonic: "LDA",
                description: "Load the accumulator with from memory."
            },
            0x8D: {
                mnemonic: "STA",
                description: "Store the accumulator in memory."
            },
            0x6D: {
                mnemonic: "ADC",
                description: "Add with carry the contents of an address to the accumulator."
            },
            0xA2: {
                mnemonic: "LDX",
                description: "Load the X register with a constant."
            },
            0xAE: {
                mnemonic: "LDX",
                description: "Load the X register with from memory."
            },
            0xA0: {
                mnemonic: "LDY",
                description: "Load the X register with a constant."
            },
            0xAC: {
                mnemonic: "LDY",
                description: "Load the Y register with from memory."
            },
            0xEA: {
                mnemonic: "NOP",
                description: "No Operation. Do nothing."
            },
            0x00: {
                mnemonic: "BRK",
                description: "Break (which is really a system call)."
            },
            0xEC: {
                mnemonic: "CPX",
                description: "Compare a byte in memory to the X reg. Sets the Z flag if equal."
            },
            0xD0: {
                mnemonic: "BNE",
                description: "Branch n bytes if Z flag = 0."
            },
            0xEE: {
                mnemonic: "INC",
                description: "Increment the value of a byte."
            },
            0xFF: {
                mnemonic: "SYS",
                description: "System call. Print integer (Xreg = 1) or string (Xreg = 2)."
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
