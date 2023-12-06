import { useEffect, useRef, useState } from "react";

interface InputAxis {
  keyCode?: string,
  buttonIndex?: number,
}

type InputConfig = Record<string, InputAxis>;
type InputState = Record<string, number>;

const useInput = (config: InputConfig, debug: boolean = false) => {
    const [gamepadPollInterval, setGamepadPollInterval] = useState(null);
    const keeb = useRef<InputState>({});
    const gamepad = useRef<InputState>({});
    const inputState = useRef<InputState>({});

    const pollGamepad = () => {
      const gp = navigator.getGamepads()[0];
      console.log(gp.buttons);
    }

    useEffect(() => {
      function handleConnected(evt: GamepadEvent) {
        console.log("Connected " + navigator.getGamepads()[evt.gamepad.index]);
        if(!gamepadPollInterval) {
            const interval = setInterval(pollGamepad, 5000);
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
        // TODO: check config
        if(evt.repeat) {
          // Drop repeat events
          return;
        }
        console.log(`${evt.type} ${evt.key}`)
        if(evt.type == 'keydown') {
          keeb.current[evt.key] = 1;
        } else if(evt.type == 'keyup') {
          keeb.current[evt.key] = 0;
        }
        console.log(keeb);
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
    return inputState;
}

export default useInput;