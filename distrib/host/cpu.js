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
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = false; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = false;
            this.isExecuting = false;
        };
        Cpu.prototype.startProcess = function (pcb) {
            this.PC = pcb.programCounter;
            this.Acc = pcb.accumulator;
            this.Xreg = pcb.Xreg;
            this.Xreg = pcb.Xreg;
            this.Zflag = pcb.Zflag;
            this.isExecuting = true;
        };
        Cpu.prototype.getConstant = function (addr) {
            return _MemoryAccessor.getValue(addr);
        };
        Cpu.prototype.getMemory = function (addr0) {
            var addr1 = _MemoryAccessor.getValue(addr0);
            return _MemoryAccessor.getValue(addr1);
        };
        Cpu.prototype.setConstant = function (addr, value) {
            _MemoryAccessor.setValue(addr, value);
        };
        Cpu.prototype.setMemory = function (addr0, value) {
            var addr1 = _MemoryAccessor.getValue(addr0);
            _MemoryAccessor.setValue(addr1, value);
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            this.isExecuting = true;
            // TODO: Accumulate CPU usage and profiling statistics here.
            //load next instruction into the IR
            this.IR = this.getConstant(this.PC);
            //perform action based on instruction
            switch (this.IR) {
                case 0xA9: //LDA (constant)
                    this.Acc = this.getConstant(++this.PC);
                    break;
                case 0xAD: //LDA (memory)
                    this.Acc = this.getMemory(++this.PC);
                    break;
                case 0x8D: //STA (memory)
                    this.setMemory(++this.PC, this.Acc);
                    break;
                case 0x6D: //ADC
                    this.Acc += this.getMemory(++this.PC);
                    break;
                case 0xA2: //LDX (constant)
                    this.Xreg = this.getConstant(++this.PC);
                    break;
                case 0xAE: //LDX (memory)
                    this.Xreg = this.getMemory(++this.PC);
                    break;
                case 0xA0: //LDY (constant)
                    this.Xreg = this.getConstant(++this.PC);
                    break;
                case 0xAC: //LDY (memory)
                    this.Xreg = this.getMemory(++this.PC);
                    break;
                case 0xEA: //NOP
                    break;
                case 0x00: //BRK
                    this.isExecuting = false;
                    break;
                case 0xEC: //CPX
                    var cmp_val = this.getMemory(++this.PC);
                    this.Zflag = (this.Xreg == cmp_val);
                    break;
                case 0xD0: //BNE
                    if (this.Zflag == false) {
                        this.PC += this.getMemory(++this.PC);
                    }
                    break;
                case 0xEE: //INC
                    var val = this.getMemory(++this.PC);
                    this.setMemory(this.PC, val + 1);
                    break;
                case 0xFF: //SYS
                    if (this.Xreg == 0x01) {
                        _StdIn.putLine(TSOS.Control.toHexStr(this.Yreg));
                    }
                    else if (this.Xreg == 0x02) {
                        var strOut = "";
                        var char_addr = this.Yreg;
                        var char_val = 0;
                        do {
                            char_val = this.getConstant(char_addr);
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
                description: "Add with carry."
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
                mnemonic: "LDA",
                description: "Load the accumulator with a constant."
            },
            0xD0: {
                mnemonic: "LDA",
                description: "Load the accumulator with a constant."
            },
            0xEE: {
                mnemonic: "LDA",
                description: "Load the accumulator with a constant."
            },
            0xFF: {
                mnemonic: "SYS",
                description: "System call. Print integer or string."
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
