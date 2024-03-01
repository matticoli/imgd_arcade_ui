import { useEffect, useRef, useState } from "react";

interface InputAxis {
  keyCode?: string,
  buttonIndex?: number,
  analogAxis?: number,
  invert?: boolean,
}
interface InputEvent {
  key: string,
  value: number,
}


type InputConfig = Record<string, InputAxis>;
type InputState = Record<string, number>;
type InputEventHandler = (evt: InputEvent) => void;
const dont: InputEventHandler = (evt: InputEvent): void => {};

const useInput = (config: InputConfig, handler: InputEventHandler = dont, debug: boolean = false) => {
    const [gamepadPollInterval, setGamepadPollInterval] = useState(null);
    const keeb = useRef<InputState>({});
    const inputState = useRef<InputState>({});

    const pollGamepad = () => {
      const gp = navigator.getGamepads()[0];
      Object.entries(config).map(([axisKey, {buttonIndex, analogAxis, invert}]) => {
        if(analogAxis) {
          const newVal = (invert ? -1 : 1)*Math.round(gp.axes[analogAxis]);
          if(inputState.current[axisKey] != newVal) {
            inputState.current[axisKey] = newVal;
            handler({key: axisKey, value: newVal});
          }
        } else if(buttonIndex) {
          const newVal = gp.buttons[buttonIndex].value;
          if(inputState.current[axisKey] != newVal) {
            inputState.current[axisKey] = newVal;
            handler({key: axisKey, value: newVal});
          }
        }
      });
      if(debug) {
        let pressedButtons = [];
        try {
          pressedButtons = gp.buttons.map((b, i) => {return {idx: i, val: b.value}}).filter(b=> b.val != 0);
        } catch(err) {
          console.log("Error getting buttons: ", err)
        }
        if(pressedButtons.length > 0) {
          console.log(pressedButtons);
        }
      }
    }

    useEffect(() => {
      function handleConnected(evt: GamepadEvent) {
        console.log("Connected " + navigator.getGamepads()[evt.gamepad.index]);
        if(!gamepadPollInterval) {
            const interval = setInterval(pollGamepad, 100);
            setGamepadPollInterval(interval);
        }
      }
      function handleDisconnected(evt: GamepadEvent) {
        console.log("Disconnected " + navigator.getGamepads()[evt.gamepad.index]);
        if(gamepadPollInterval) {
            clearTimeout(gamepadPollInterval);
            setGamepadPollInterval(null);
        }
      }

      function handleKeyEvent(evt: KeyboardEvent) {
        if(evt.repeat) {
          // Drop repeat events
          return;
        }
        if(debug)
          console.log(`${evt.type} ${evt.key}`);

        const configedKeys = Object.entries(config).filter(([_axisKey, {keyCode}]) => keyCode == evt.key);
        if(configedKeys.length > 0) {
          const axisKey = configedKeys[0][0];
          if(evt.type == 'keydown') {
            inputState.current[axisKey] = 1;
            keeb.current[axisKey] = 1;
            handler({key: axisKey, value: 1});
            
          } else if(evt.type == 'keyup') {
            inputState.current[axisKey] = 0;
            keeb.current[axisKey] = 0;
            handler({key: axisKey, value: 0});
          }
        }
      }

      console.log("Registering gamepad listeners...");
      window.addEventListener('gamepadconnected', handleConnected);
      window.addEventListener('gamepaddisconnected', handleDisconnected);
      window.addEventListener('keydown', handleKeyEvent);
      window.addEventListener('keyup', handleKeyEvent);
      return () => {
        console.log("Clearing gamepad listeners...");
        window.removeEventListener('gamepadconnected', handleConnected);
        window.removeEventListener('gamepaddisconnected', handleDisconnected);
        window.removeEventListener('keydown', handleKeyEvent);
        window.removeEventListener('keyup', handleKeyEvent);
      };
    }, [gamepadPollInterval]);
    return {inputState, keyboard: keeb};
}

export default useInput;