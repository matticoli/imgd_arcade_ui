import type { NextPage } from 'next'
import { useRouter } from 'next/router'


const GamePage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  
  return <>
    <div style={{width: "100vw", height: "100vh", backgroundColor: "#333333"}}>
      <p>Hold 😺 to go return to game selection screen</p>
      <iframe style={{border: "none", marginTop: "5%"}} width="100%" height="90%" src={`https://itch.io/embed-upload/${id}?color=333333`}></iframe>
    </div>
  </>
}

export default GamePage;