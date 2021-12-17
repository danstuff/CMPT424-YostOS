
module TSOS {

    export class Block {
        public in_use: boolean = false;
        public next_address: number = 0;

        public data: string;

        public address: number = 0;

        public loadBlock(loc) {
            _krnDiskDriver.krnDskMove(loc);

            this.address = loc;

            this.data = _krnDiskDriver.krnDskRead();

            //first 4 bytes are dirty flag and next address
            this.in_use = 
                (this.data.substr(0, 1) == "U") ? true : false;
            this.next_address = 
                DeviceDriverDisk.locStrToNum(this.data.substr(1, 3));
            
        }

        public createBlock() {
            //search first sector for an empty block
            var loc = 0;
            while(loc < 2048) {
                var b = new Block();
                b.loadBlock(loc);

                if(!b.in_use) {
                    this.loadBlock(loc);
                    this.in_use = true;
                    return true;
                }

                loc++;
            }

            return false;
        }

        public saveBlock() {
            _krnDiskDriver.krnDskMove(this.address);

            this.data = 
                ((this.in_use) ? "U" : "\0") +
                DeviceDriverDisk.locNumToStr(this.next_address) +
                this.data.slice(4);
            
            _krnDiskDriver.krnDskWrite(this.data);
        }

        public deleteBlock() {
            this.in_use = false;
            this.next_address = 0;
            this.data = _krnDiskDriver.clearBlock;

            this.saveBlock();
        }

        public addNextBlock() {
            if(this.next_address == 0) {
                var nb = new Block();
                nb.createBlock();

                this.next_address = nb.address;
                this.saveBlock();
                return nb;

            } else {
                var nb = new Block();
                nb.loadBlock(this.next_address);
                
                if(nb.in_use) {
                    return nb.addNextBlock(); 
                } else {
                    return nb;
                }
            }
        }

        public delete() {
            if(this.next_address != 0) {
                var nb = new Block();
                nb.loadBlock(this.next_address);
                nb.delete(); 
            }

            this.in_use = false;
            this.next_address = 0;
            this.saveBlock();
        }
    }

    export class File extends Block {
        //FCBs are 64 bytes in length
        //in use - 1 byte
        //next block address - 3 bytes
        //name - 57 bytes/characters
        //file_size - 3 bytes

        public name: string;
        public file_size: number = 0; // in blocks

        constructor() {
            super();
        }

        loadFCB(filename: string) {
            this.name = filename;

            //pass 1  - search the first sector for matching FCBs
            for(var loc = 0; loc < 256; loc++) {
                var b = new Block();
                b.loadBlock(loc);

                //center 57 bytes are name
                var name = b.data.substr(4, 57).replace(/\0/g, "");

                if(b.in_use && name === this.name) {
                    this.loadBlock(loc);

                    //final 3 bytes are size
                    this.file_size = 
                        DeviceDriverDisk.locStrToNum(
                        this.data.substr(61, 3));

                    return true;
                }
            }

            //pass 2 - search for an empty FCB
            this.createBlock();
            return false;
        }

        saveFCB() {
            //ensure equal number of characters
            var space_count = 54 - this.name.length;            
        
            if(space_count > 0) {
                this.name += Array(space_count).join("\0");
            } else if(space_count < 0) {
                this.name = this.name.substr(0, 54);
            }

            //put name into data
            this.data = this.data.slice(0, 4) + this.name +
                DeviceDriverDisk.locNumToStr(this.file_size);

            this.saveBlock();
        }

        addToFile(data) {
            var b = this.addNextBlock();
            b.in_use = true;
            b.data = b.data.slice(0, 4) + data;
            this.file_size++;
            b.saveBlock();
            this.saveFCB();
        }
    }
}
