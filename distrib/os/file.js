var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    var Block = /** @class */ (function () {
        function Block() {
            this.in_use = false;
            this.next_address = 0;
            this.address = 0;
        }
        Block.prototype.loadBlock = function (loc) {
            _krnDiskDriver.krnDskMove(loc);
            this.address = loc;
            this.data = _krnDiskDriver.krnDskRead();
            //first 4 bytes are dirty flag and next address
            this.in_use =
                (this.data.substr(0, 1) == "U") ? true : false;
            this.next_address =
                TSOS.DeviceDriverDisk.locStrToNum(this.data.substr(1, 3));
        };
        Block.prototype.createBlock = function () {
            //search first sector for an empty block
            var loc = 0;
            while (loc < 2048) {
                var b = new Block();
                b.loadBlock(loc);
                if (!b.in_use) {
                    this.loadBlock(loc);
                    this.in_use = true;
                    return true;
                }
                loc++;
            }
            return false;
        };
        Block.prototype.saveBlock = function () {
            _krnDiskDriver.krnDskMove(this.address);
            this.data =
                ((this.in_use) ? "U" : "\0") +
                    TSOS.DeviceDriverDisk.locNumToStr(this.next_address) +
                    this.data.slice(4);
            _krnDiskDriver.krnDskWrite(this.data);
        };
        Block.prototype.deleteBlock = function () {
            this.in_use = false;
            this.next_address = 0;
            this.data = _krnDiskDriver.clearBlock;
            this.saveBlock();
        };
        Block.prototype.addNextBlock = function () {
            if (this.next_address == 0) {
                var nb = new Block();
                nb.createBlock();
                this.next_address = nb.address;
                this.saveBlock();
                return nb;
            }
            else {
                var nb = new Block();
                nb.loadBlock(this.next_address);
                if (nb.in_use) {
                    return nb.addNextBlock();
                }
                else {
                    return nb;
                }
            }
        };
        Block.prototype["delete"] = function () {
            if (this.next_address != 0) {
                var nb = new Block();
                nb.loadBlock(this.next_address);
                nb["delete"]();
            }
            this.in_use = false;
            this.next_address = 0;
            this.saveBlock();
        };
        return Block;
    }());
    TSOS.Block = Block;
    var File = /** @class */ (function (_super) {
        __extends(File, _super);
        function File() {
            var _this = _super.call(this) || this;
            _this.file_size = 0; // in blocks
            return _this;
        }
        File.prototype.loadFCB = function (filename) {
            this.name = filename;
            //pass 1  - search the first sector for matching FCBs
            for (var loc = 0; loc < 256; loc++) {
                var b = new Block();
                b.loadBlock(loc);
                //center 57 bytes are name
                var name = b.data.substr(4, 57).replace(/\0/g, "");
                if (b.in_use && name === this.name) {
                    this.loadBlock(loc);
                    //final 3 bytes are size
                    this.file_size =
                        TSOS.DeviceDriverDisk.locStrToNum(this.data.substr(61, 3));
                    return true;
                }
            }
            //pass 2 - search for an empty FCB
            this.createBlock();
            return false;
        };
        File.prototype.saveFCB = function () {
            //ensure equal number of characters
            var space_count = 54 - this.name.length;
            if (space_count > 0) {
                this.name += Array(space_count).join("\0");
            }
            else if (space_count < 0) {
                this.name = this.name.substr(0, 54);
            }
            //put name into data
            this.data = this.data.slice(0, 4) + this.name +
                TSOS.DeviceDriverDisk.locNumToStr(this.file_size);
            this.saveBlock();
        };
        File.prototype.addToFile = function (data) {
            var b = this.addNextBlock();
            b.in_use = true;
            b.data = b.data.slice(0, 4) + data;
            this.file_size++;
            b.saveBlock();
            this.saveFCB();
        };
        return File;
    }(Block));
    TSOS.File = File;
})(TSOS || (TSOS = {}));
