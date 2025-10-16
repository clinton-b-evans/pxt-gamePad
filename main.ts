/*!
 * Custom GamePad for micro:bit
 * Buttons: Blue(P16), Red(P15), Green(P13), Yellow(P14), Z-Click(P8)
 * Joystick: X(P1), Y(P2)  |  Motor: P12 (0–255)
 * License: LGPL-2.1
 */

//% color=#DF6721 icon="\uf11b" block="gamePad"
namespace gamePad {
    // ---- Button enum (DigitalPin values) ----
    export enum GamePadButton {
        //% block="Blue (P16)"
        Blue = <number>DigitalPin.P16,
        //% block="Red (P15)"
        Red = <number>DigitalPin.P15,
        //% block="Green (P13)"
        Green = <number>DigitalPin.P13,
        //% block="Yellow (P14)"
        Yellow = <number>DigitalPin.P14,
        //% block="Z-Click (P8)"
        ZClick = <number>DigitalPin.P8
    }

    export enum GamePadEvent {
        //% block="pressed"
        Pressed,
        //% block="released"
        Released
    }

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

    let _inited = false
    function initPins() {
        if (_inited) return
        // Leave buttons floating (the pad biases them); motor pin is PWM
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P16, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P12, PinPullMode.PullNone)
        _inited = true
    }

    // ---------------- Buttons ----------------

    /**
     * Check if a button is currently pressed (active-low).
     */
    //% blockId=gp_buttonPressed_v2
    //% block="button %btn is pressed"
    //% btn.fieldEditor="gridpicker" btn.fieldOptions.columns=3
    export function buttonPressed(btn: GamePadButton): boolean {
        initPins()
        const dp = <DigitalPin><number>btn
        return pins.digitalReadPin(dp) == 0
    }

    /**
     * Run code when a button is pressed or released.
     * (Uses pin pulse detection – no native shim required.)
     */
    //% blockId=gp_onButtonEvent_v2
    //% block="on %btn %ev"
    //% btn.fieldEditor="gridpicker" btn.fieldOptions.columns=3
    //% ev.fieldEditor="gridpicker" ev.fieldOptions.columns=3
    export function onButtonEvent(btn: GamePadButton, ev: GamePadEvent, handler: () => void) {
        initPins()
        const dp = <DigitalPin><number>btn
        if (ev == GamePadEvent.Pressed) {
            pins.onPulsed(dp, PulseValue.Low, handler)
        } else {
            pins.onPulsed(dp, PulseValue.High, handler)
        }
    }

    // --------------- Joystick ----------------

    /**
     * Joystick X-axis (P1), 0–1023
     */
    //% blockId=gp_joystickX_v2 block="joystick X (P1)"
    export function joystickX(): number {
        return pins.analogReadPin(AnalogPin.P1)
    }

    /**
     * Joystick Y-axis (P2), 0–1023
     */
    //% blockId=gp_joystickY_v2 block="joystick Y (P2)"
    export function joystickY(): number {
        return pins.analogReadPin(AnalogPin.P2)
    }

    // ---------------- Motor & LED ----------------

    /**
     * Vibration motor on P12 (0–255)
     */
    //% blockId=gp_motor_v2 block="vibration motor %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    export function motor(state: Motor): void {
        initPins()
        pins.analogWritePin(AnalogPin.P12, <number>state)
    }

    /**
     * LED on P16 (optional external LED)
     */
    //% blockId=gp_led_v2 block="LED %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    export function led(state: Led): void {
        initPins()
        pins.digitalWritePin(DigitalPin.P16, <number>state)
    }
}
