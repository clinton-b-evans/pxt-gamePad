/*!
 * @file main.ts
 * @brief DFRobot's gamer pad MakeCode library — customized by Clinton (GetCTRL)
 * @details Blue(P16), Red(P15), Green(P13), Yellow(P14), Z-Click(P8), Motor(P12)
 * @license GNU Lesser General Public License
 */

// ===========================================================
// ENUMS: Button Pins & Events
// ===========================================================

/**
 * GamePad Buttons for DFRobot gamer:bit.
 */
//%
enum GamePadButton {
    //% block="Blue (P16)"
    Blue = DAL.MICROBIT_ID_IO_P16,
    //% block="Red (P15)"
    Red = DAL.MICROBIT_ID_IO_P15,
    //% block="Green (P13)"
    Green = DAL.MICROBIT_ID_IO_P13,
    //% block="Yellow (P14)"
    Yellow = DAL.MICROBIT_ID_IO_P14,
    //% block="Z-Click (P8)"
    ZClick = DAL.MICROBIT_ID_IO_P8
}

/**
 * Button event triggers.
 */
//%
enum GamePadEvent {
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

//% color=#DF6721 icon="\uf11b" block="gamePad"
namespace gamePad {
    let PIN_INIT = 0

    export enum Motor {
        //% block="off"
        Off = 0,
        //% block="on"
        On = 255
    }

    export enum Led {
        //% block="off"
        Off = 0,
        //% block="on"
        On = 1
    }

    // -----------------------------------------------------------
    // Initialization
    // -----------------------------------------------------------

    //% shim=gamerpad::init
    function init(): void { return }

    function PinInit(): void {
        // Disable internal pull-ups for external gamepad control lines
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P16, PinPullMode.PullNone)
        // Motor pin
        pins.setPull(DigitalPin.P12, PinPullMode.PullNone)
        PIN_INIT = 1
    }

    // -----------------------------------------------------------
    // Button State & Events
    // -----------------------------------------------------------

    /**
     * Check if a gamePad button is pressed.
     */
    //% weight=90
    //% blockId=gamePad_buttonPressed block="button %btn is pressed"
    //% btn.fieldEditor="gridpicker" btn.fieldOptions.columns=3
    export function buttonPressed(btn: GamePadButton): boolean {
        if (!PIN_INIT) PinInit()
        return pins.digitalReadPin(<number>btn) == 0
    }

    /**
     * Run code when a button event occurs.
     */
    //% weight=80
    //% blockId=gamePad_onButtonEvent block="on %btn %event"
    //% btn.fieldEditor="gridpicker" btn.fieldOptions.columns=3
    //% event.fieldEditor="gridpicker" event.fieldOptions.columns=3
    export function onButtonEvent(btn: GamePadButton, event: GamePadEvent, handler: Action): void {
        init()
        if (!PIN_INIT) PinInit()
        control.onEvent(<number>btn, <number>event, handler)
    }

    // -----------------------------------------------------------
    // Joystick Axes (P1 and P2) — analog read only
    // -----------------------------------------------------------

    /**
     * Get joystick X-axis value (P1).
     */
    //% weight=70
    //% blockId=gamePad_joystickX block="joystick X (P1)"
    export function joystickX(): number {
        return pins.analogReadPin(AnalogPin.P1)
    }

    /**
     * Get joystick Y-axis value (P2).
     */
    //% weight=70
    //% blockId=gamePad_joystickY block="joystick Y (P2)"
    export function joystickY(): number {
        return pins.analogReadPin(AnalogPin.P2)
    }

    // -----------------------------------------------------------
    // Motor (P12) and LED indicator (P16 optional reuse)
    // -----------------------------------------------------------

    /**
     * Turn vibration motor on/off.
     */
    //% weight=60
    //% blockId=gamePad_motor block="vibration motor %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    export function motor(state: Motor): void {
        if (!PIN_INIT) PinInit()
        pins.analogWritePin(AnalogPin.P12, <number>state)
    }

    /**
     * LED indicator (use separate onboard or external LED).
     */
    //% weight=40
    //% blockId=gamePad_led block="LED %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    export function led(state: Led): void {
        if (!PIN_INIT) PinInit()
        pins.digitalWritePin(DigitalPin.P16, <number>state)
    }
}
