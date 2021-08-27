/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

const KeySpecials = {
    32: ' ',
    13: '#Enter',
    9: '#Tab',
    38: '#Up',
    40: '#Down',
    8: '#Backspace'
}

const KeyPairs = {
    192: [ '`', '~' ],
    49: [ '1', '!' ],
    50: [ '2', '@' ],
    51: [ '3', '#' ],
    52: [ '4', '$' ],
    53: [ '5', '%' ],
    54: [ '6', '^' ],
    55: [ '7', '&' ],
    56: [ '8', '*' ],
    57: [ '9', '(' ],
    48: [ '0', ')' ],
    173: [ '-', '_' ],
    61: [ '=', '+' ],

    219: [ '[', '{' ],
    221: [ ']', '}' ],
    220: [ '\\', '|' ],
    
    59: [ ';', ':' ],
    222: [ '\'', '"' ],

    188: [ ',', '<' ],
    190: [ '.', '>' ],
    191: [ '/', '?' ]
};

module TSOS {
    
    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {


        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";

            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) { 
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                } else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);

            // check if keycode is a special control button (enter, up arrow, etc.)
            } else if (KeySpecials[keyCode]) {
                chr = KeySpecials[keyCode];
                _KernelInputQueue.enqueue(chr);
            
            //check if the key code matches a key pair
            } else if(KeyPairs[keyCode]){
                //if shifted, output the 2nd in the pair, if not, the 1st.
                if(isShifted === true) {
                    chr = KeyPairs[keyCode][1];
                } else {
                    chr = KeyPairs[keyCode][0];
                }

                _KernelInputQueue.enqueue(chr);
            }
        }
    }
}
