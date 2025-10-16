/*!
 * @file gamePad/main.ts
 * @brief DFRobot's gamer pad MakeCode library.
 * @n Updated version with full 8-button + joystick support for Micro:bit.
 * @n Original © DFRobot, modified by Clinton (GetCTRL).
 * @n Licensed under GNU Lesser General Public License.
 */

// ===========================================================
// ENUMS: Button Pins & Events
// ===========================================================

/**
 * User Buttons for DFRobot gamer:bit players.
 */
//%
enum GamerBitPin {
    //% block="X button (P1)"
    P1 = DAL.MICROBIT_ID_IO_P1,
    //% block="Y button (P2)"
    P2 = DAL.MICROBIT_ID_IO_P2,
    //% block="D-PAD up (P8)"
    P8 = DAL.MICROBIT_ID_IO_P8,
    //% block="D-PAD down (P13)"
    P13 = DAL.MICROBIT_ID_IO_P13,
    //% block="D-PAD left (P14)"
    P14 = DAL.MICROBIT_ID_IO_P14,
    //% block="D-PAD right (P15)"
    P15 = DAL.MICROBIT_ID_IO_P15,
    //% block="A (P16)"
    P16 = DAL.MICROBIT_ID_IO_P16,
    //% block="B (P0)"
    P0 = DAL.MICROBIT_ID_IO_P0
}

/**
 * Trigger Events for DFRobot gamer:bit players.
 */
//%
enum GamerBitEvent {
    //% block="pressed"
    Down = DAL.MICROBIT_BUTTON_EVT_DOWN,
    //% block="released"
    Up = DAL.MICROBIT_BUTTON_EVT_UP,
    //% block="click"
    Click = DAL.MICROBIT_BUTTON_EVT_CLICK
}

// ===========================================================
// NAMESPACE: gamePad
// ===========================================================

//% weight=10 color=#DF6721 icon="\uf11b" block="gamePad"
namespace gamePad {
    let PIN_INIT = 0;

    export enum Vibrator { 
        //% block="stop"
        V0 = 0,
        //% block="vibrate"
        V1 = 255
    }

    export enum Intensity { 
        //% block="stop"
        I0 = 0,
        //% block="weak"
        I1 = 100,
        //% block="medium"
        I2 = 180,
        //% block="strong"
        I3 = 225
    }

    export enum Led {
        //% block="off"
        OFF = 0,
        //% block="on"
        ON = 1
    }

    // -----------------------------------------------------------
    // Initialization
    // -----------------------------------------------------------

    //% shim=gamerpad::init
    function init(): void { return; }

    function PinInit(): void {
        pins.setPull(DigitalPin.P1, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P2, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P0, PinPullMode.PullUp);
        pins.setPull(DigitalPin.P16, PinPullMode.PullUp);
        PIN_INIT = 1;
    }

    // -----------------------------------------------------------
    // Button State & Events
    // -----------------------------------------------------------

    /**
     * Check if a button is pressed.
     */
    //% weight=90
    //% blockId=gamePad_keyState block="button %button is pressed"
    //% button.fieldEditor="gridpicker" button.fieldOptions.columns=3
    export function keyState(button: GamerBitPin): boolean {
        if (!PIN_INIT) PinInit();
        return pins.digitalReadPin(<number>button) == 0;
    }

    /**
     * Run code when a button event occurs.
     */
    //% weight=80
    //% blockGap=48
    //% blockId=gamePad_onEvent block="on button %button %event"
    //% button.fieldEditor="gridpicker" button.fieldOptions.columns=3
    //% event.fieldEditor="gridpicker" event.fieldOptions.columns=3
    export function onEvent(button: GamerBitPin, event: GamerBitEvent, handler: Action): void {
        init();
        if (!PIN_INIT) PinInit();
        control.onEvent(<number>button, <number>event, handler);
    }

    // -----------------------------------------------------------
    // Joystick Axes
    // -----------------------------------------------------------

    /**
     * Get joystick X-axis (P1).
     */
    //% weight=70
    //% blockId=gamePad_joystickX block="joystick X (P1)"
    export function joystickX(): number {
        return pins.analogReadPin(AnalogPin.P1);
    }

    /**
     * Get joystick Y-axis (P2).
     */
    //% weight=70
    //% blockId=gamePad_joystickY block="joystick Y (P2)"
    export function joystickY(): number {
        return pins.analogReadPin(AnalogPin.P2);
    }

    // -----------------------------------------------------------
    // Vibration Motor
    // -----------------------------------------------------------

    /**
     * Turn the vibration motor on/off.
     */
    //% weight=60
    //% blockId=gamePad_vibratorMotor block="vibrator motor %index"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function vibratorMotor(index: Vibrator): void {
        vibratorMotorSpeed(<number>index);
    }

    /**
     * Set vibration motor intensity (0–255).
     */
    //% weight=50
    //% blockGap=48
    //% blockId=gamePad_vibratorMotorSpeed block="vibration motor intensity %degree"
    //% degree.min=0 degree.max=255
    export function vibratorMotorSpeed(degree: number): void {
        if (!PIN_INIT) PinInit();
        const value = Math.min(degree, 255);
        pins.analogWritePin(AnalogPin.P12, value);
    }

    // -----------------------------------------------------------
    // LED Indicator
    // -----------------------------------------------------------

    /**
     * Turn the LED indicator on or off.
     */
    //% weight=40
    //% blockId=gamePad_led block="LED %index"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function led(index: Led): void {
        if (!PIN_INIT) PinInit();
        pins.digitalWritePin(DigitalPin.P16, <number>index);
    }
}
