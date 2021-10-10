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

module TSOS {

    export class Cpu {

        static instructions = {
            0xA9 : {
                mnemonic: "LDA",
                description: "Load the accumulator with a constant."
            },

            0xAD : {
                mnemonic: "LDA",
                description: "Load the accumulator with from memory."
            },

            0x8D : {
                mnemonic: "STA",
                description: "Store the accumulator in memory."
            },

            0x6D : {
                mnemonic: "ADC",
                description: "Add with carry."
            },

            0xA2 : {
                mnemonic: "LDX",
                description: "Load the X register with a constant."
            },

            0xAE : {
                mnemonic: "LDX",
                description: "Load the X register with from memory."
            },

            0xA0 : {
                mnemonic: "LDY",
                description: "Load the X register with a constant."
            },


            0xAC : {
                mnemonic: "LDY",
                description: "Load the Y register with from memory."
            },

            0xEA : {
                mnemonic: "NOP",
                description: "No Operation. Do nothing."
            },

            0x00 : {
                mnemonic: "BRK",
                description: "Break (which is really a system call)."
            },


            0xEC : {
                mnemonic: "LDA",
                description: "Load the accumulator with a constant."
            },

            0xD0 : {
                mnemonic: "LDA",
                description: "Load the accumulator with a constant."
            },


            0xEE : {
                mnemonic: "LDA",
                description: "Load the accumulator with a constant."
            },

            0xFF : {
                mnemonic: "SYS",
                description: "System call. Print integer or string."
            }
        };

        constructor(public PC: number = 0,
                    public IR: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public startProcess(pcb: PCB) {
            this.PC = pcb.programCounter;
            this.Acc = pcb.accumulator;
            this.Xreg = pcb.Xreg;
            this.Xreg = pcb.Xreg;
            this.Zflag = pcb.Zflag;
            this.isExecuting = true;
        }
        
        public getConstant(addr: number) {
            return _MemoryAccessor.getValue(addr);
        }

        public getMemory(addr0: number) {
            var addr1 =  _MemoryAccessor.getValue(addr0);
            return _MemoryAccessor.getValue(addr1);
        }        

        public setConstant(addr: number, value: number) {
            _MemoryAccessor.setValue(addr, value);
        }

        public setMemory(addr0: number, value: number) {
            var addr1 =  _MemoryAccessor.getValue(addr0);
            _MemoryAccessor.setValue(addr1, value);
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            this.isExecuting = true;

            // TODO: Accumulate CPU usage and profiling statistics here.

            //load next instruction into the IR
            this.IR = _MemoryAccessor.getConstant(this.PC);

            //perform action based on instruction
            switch(this.IR) {

                case 0xA9:  //LDA (constant)
                    this.Acc = this.getConstant(++this.PC);
                    break;

                case 0xAD:  //LDA (memory)
                    this.Acc = this.getMemory(++this.PC);
                    break;

                case 0x8D:  //STA (memory)
                    this.setMemory(++this.PC, this.Acc);
                    break;

                case 0x6D:  //ADC
                    this.Acc += this.getMemory(++this.PC);
                    break;

                case 0xA2:  //LDX (constant)
                    this.Xreg = this.getConstant(++this.PC);
                    break;

                case 0xAE:  //LDX (memory)
                    this.Xreg = this.getMemory(++this.PC);
                    break;

                case 0xA0:  //LDY (constant)
                    this.Xreg = this.getConstant(++this.PC);
                    break;
                
                case 0xAC:  //LDY (memory)
                    this.Xreg = this.getMemory(++this.PC);
                    break;
                
                case 0xEA:  //NOP
                    break;
                
                case 0x00:  //BRK
                    this.isExecuting = false;
                    break;
                
                case 0xEC:  //CPX
                    var cmp_val = this.getMemory(++this.PC);
                    this.Zflag = (this.Xreg == cmp_val);
                    break;
                
                case 0xD0:  //BNE
                    if(this.Zflag == 0) {
                        this.PC += this.getMemory(++this.PC);
                    }
                    break;
                
                case 0xEE:  //INC
                    var val = this.getMemory(++this.PC);
                    this.setMemory(this.PC, val+1);
                    break;
                
                case 0xFF:  //SYS
                    if(this.Xreg == 0x01) {
                        _StdIn.putLine(this.Yreg);
                    } else if(this.Xreg == 0x02) {
                        var strOut = "";

                        var char_addr = this.Yreg;
                        var char_val = 0;

                        do {
                            char_val = this.getConstant(char_addr);
                            char_addr++;

                            strOut += String.fromCharCode(char_val);
                        } while(char_val != 0 && char_addr < MEMORY_SIZE);
                        
                        _StdIn.putLine(strOut);
                    }
                    break;
            }

            this.PC++;
        }
    }
}
