/*!
 * Custom GamePad for micro:bit
 * Buttons: Blue(P16), Red(P15), Green(P13), Yellow(P14), Z-Click(P8)
 * Joystick: X(P1), Y(P2)
 * License: LGPL-2.1
 */

/* ---------------- Enums (numeric literals; top-level) ---------------- */

//% block="gamePad button"
enum GamePadButton {
    //% block="Blue (P16)"
    Blue = 0,
    //% block="Red (P15)"
    Red = 1,
    //% block="Green (P13)"
    Green = 2,
    //% block="Yellow (P14)"
    Yellow = 3,
    //% block="Z-Click (P8)"
    ZClick = 4
}

//% block="gamePad event"
enum GamePadEvent {
    //% block="pressed"
    Pressed = 0,
    //% block="released"
    Released = 1
}

//% block="LED state"
enum Led {
    //% block="off"
    Off = 0,
    //% block="on"
    On = 1
}

/* ---------------- Implementation ---------------- */

//% color=#DF6721 icon="\uf11b" block="gamePad"
namespace gamePad {
    let _inited = false

    function initPins() {
        if (_inited) return
        // Buttons are externally biased; leave floating
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P16, PinPullMode.PullNone)
        // No pin initialization for Motor P12 needed now
        _inited = true
    }

    // Map enum label -> actual DigitalPin
    function btnToPin(btn: GamePadButton): DigitalPin {
        switch (btn) {
            case GamePadButton.Blue:   return DigitalPin.P16
            case GamePadButton.Red:    return DigitalPin.P15
            case GamePadButton.Green:  return DigitalPin.P13
            case GamePadButton.Yellow: return DigitalPin.P14
            case GamePadButton.ZClick: return DigitalPin.P8
        }
        return DigitalPin.P16
    }

    /**
     * Check if a button is currently pressed (active-low).
     */
    //% blockId=gp_buttonPressed_v4
    //% block="button %btn is pressed"
    //% btn.fieldEditor="gridpicker" btn.fieldOptions.columns=3
    export function buttonPressed(btn: GamePadButton): boolean {
        initPins()
        return pins.digitalReadPin(btnToPin(btn)) == 0
    }

    /**
     * Run code when a button is pressed or released.
     */
    //% blockId=gp_onButtonEvent_v4
    //% block="on %btn %ev"
    //% btn.fieldEditor="gridpicker" btn.fieldOptions.columns=3
    //% ev.fieldEditor="gridpicker" ev.fieldOptions.columns=3
    export function onButtonEvent(btn: GamePadButton, ev: GamePadEvent, handler: () => void) {
        initPins()
        const dp = btnToPin(btn)
        if (ev == GamePadEvent.Pressed) {
            // Register an event handler for a LOW pulse (button pressed)
            pins.onPulsed(dp, PulseValue.Low, handler)
        } else {
            // Register an event handler for a HIGH pulse (button released)
            pins.onPulsed(dp, PulseValue.High, handler)
        }
    }

    /**
     * Joystick X-axis (P1), 0–1023
     */
    //% blockId=gp_joystickX_v4 block="joystick X (P1)"
    export function joystickX(): number {
        return pins.analogReadPin(AnalogPin.P1)
    }

    /**
     * Joystick Y-axis (P2), 0–1023
     */
    //% blockId=gp_joystickY_v4 block="joystick Y (P2)"
    export function joystickY(): number {
        return pins.analogReadPin(AnalogPin.P2)
    }

    /**
     * LED on P16 (optional external LED, shared with Blue button)
     */
    //% blockId=gp_led_v4 block="LED %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    export function led(state: Led): void {
        initPins()
        pins.digitalWritePin(DigitalPin.P16, <number>state)
    }
}
