import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react';

const timer = (t = 5, beep = () => {}) => {
  if(t > 0) {
    setTimeout(() => {
      timer(t - 0.1, beep);
    }, 100);
  }
}

const GamePage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;

  const [timer, setTimer] = useState(() => {});

  useInput({
    "home": {keyCode: "Escape"},
  }, (evt) => {
      if(evt.key == 'home' && evt.value == 1) {
          const d = new Date();
          d.setSeconds(d.getSeconds() + 5);
          
      }
  }, true);
  
  return <>
    <div style={{width: "100vw", height: "100vh", backgroundColor: "#333333"}}>
      <p>Hold 😺 to go return to game selection screen</p>
      <iframe style={{border: "none", marginTop: "5%"}} width="100%" height="90%" src={`https://itch.io/embed-upload/${id}?color=333333`}></iframe>
    </div>
  </>
}

export default GamePage;