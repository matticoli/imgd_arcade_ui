import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useInput from '../../components/GamepadAPI';
import { useEffect, useState } from 'react';
import { nativeImage } from 'electron';

const TIMER_INTERVAL = 100;

const GamePage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;

  const [delay, setDelay] = useState<NodeJS.Timeout | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState<number>(new Date().getTime());
  const [evt, setEvt] = useState({value: 0});

  // 5s timer for holding down esc to return to menu
  useInput({
    "home": { keyCode: "Escape", buttonIndex: 6 },
  }, (evt) => {
    setEvt(evt);
  });

  useEffect(() => {
    if(evt.value == 1 && !delay) {
      const time = (timeLeft: number) => {
        setTimeLeft(timeLeft)
        if(timeLeft <= 0) {
          window.location.href = "/home";
        } else {
          setDelay(setTimeout(() => time(timeLeft - TIMER_INTERVAL), TIMER_INTERVAL));
        }
      };
      setDelay(setTimeout(() => time(5000), TIMER_INTERVAL));
    } else if(evt.value == 0 && delay) {
      clearTimeout(delay);
      setDelay(undefined);
      setTimeLeft(5000);
    }
  }, [evt])

  return <>
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#333333" }}>
      <p>Hold top left button for {!!delay ? <b>{timeLeft.toFixed(1)}</b> : " 5 "} seconds to go return to game selection screen</p>
      <iframe style={{ border: "none", marginTop: "5%" }} width="100%" height="90%" src={`https://itch.io/embed-upload/${id}?color=333333`}></iframe>
    </div>
  </>
}

export default GamePage;