import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import useInput from "../components/GamepadAPI";
import { useRouter } from 'next/router';
import { setEnvironmentData } from 'worker_threads';

const Root = styled('div')(({ theme }) => {
    return {
        textAlign: 'center',
        paddingTop: theme.spacing(4),
    };
})

function Home() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleClick = () => setOpen(true);
    const [selectedGame, setSelectedGame] = useState(null);
    const [evt, setEvt] = useState({key: "", value: -1});

    const [games, setGames] = useState([
        { "link": "https://jingruchenmax.itch.io/arcade-key-binding", "title": "arcade key binding by jingruchenmax", "embed": "9710961", "cover": "https://avatars.githubusercontent.com/u/36019727?v=4" },
    ]);

    // TODO: Fetch game info from remote
    // useEffect(() => {
    //     fetch("/api/gameinfo").then(async (res) => {
    //         setGames((await res.json()).games);
    //         setLoading(false);
    //     }).catch(() => {
    //         setLoading(false);
    //     });
    // }, []);

    const selectGame = (game) => {
        setSelectedGame(game);
        try {
            document.getElementById(`game-${game.embed}`).focus();
        } catch(e) {
            console.error(e);
        }
    }

    useEffect(() => {
        // Button down
        if(evt.value == 1) {
            if(evt.key == "a" && !!selectedGame) {
                router.push(`/game?id=${selectedGame.embed}`);
            } else if(evt.key == "down" || evt.key == "right" || (evt.key == "ay" && evt.value > 0)) {
                if(!!selectedGame) {
                    const index = games.indexOf(selectedGame) + 1;
                    selectGame(games[index >= games.length ? 0 : index]);
                } else {
                    selectGame(games[0]);
                }
            } else if(evt.key == "up" || evt.key == "left" || (evt.key == "ay" && evt.value < 0)) {
                if(!!selectedGame) {
                    const index = games.indexOf(selectedGame) - 1;
                    selectGame(games[index < 0 ? games.length - 1 : index]);
                } else {
                    selectGame(games[games.length - 1]);
                }
            }
        }
    }, [evt]);

    useInput({
        "left": { keyCode: "ArrowLeft" },
        "right": { keyCode: "ArrowRight" },
        "up": { keyCode: "ArrowUp" },
        "down": { keyCode: "ArrowDown" },
        "ax": { analogAxis: 0 },
        "ay": { analogAxis: 1 },
        "home": { keyCode: "Escape", buttonIndex: 6 },
        "a": { keyCode: "j", buttonIndex: 0 },
        "b": { keyCode: "k", buttonIndex: 1 },
        "x": { keyCode: "l", buttonIndex: 2 },
    }, (evt) => {
        console.log(evt);
        setEvt(evt);
    });

    return (
        <React.Fragment>
            <Head>
                <title>IMGD Arcade</title>
                <style>
                    {`
                    .lds-dual-ring {
                    display: inline-block;
                    width: 80px;
                    height: 80px;
                    margin-right: auto;
                    margin-left: auto;
                    }
                    .lds-dual-ring:after {
                    content: " ";
                    display: block;
                    width: 64px;
                    height: 64px;
                    margin: 8px;
                    border-radius: 50%;
                    border: 6px solid #fff;
                    border-color: #fff transparent #fff transparent;
                    animation: lds-dual-ring 1.2s linear infinite;
                    }
                    @keyframes lds-dual-ring {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                    }
                `}
                </style>
            </Head>
            <Root>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 10, alignContent: "center" }}>
                    <img height="150" src="/images/imgd.png" />
                    <img height="120" style={{ borderRadius: 5 }} src="/images/qr-code.png" />
                    <img height="140" src="/images/joybox.png" />
                </div>
                <Typography variant="h4" gutterBottom>
                    IMGD Arcade
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    https://imgdhub.wpi.edu/lore/arcade
                </Typography>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center", alignItems: "center" }}>
                    {loading && <div className='lds-dual-ring'></div>}
                    {games.map(g => <div key={g.embed} style={{ maxWidth: "45%", margin: "2.5%" }}>
                        <Button variant="contained"
                                color={selectedGame && g.embed == selectedGame.embed ? "secondary" : "primary"}
                                id={`game-${g.embed}`}
                                onMouseOver={() => setSelectedGame(g)}
                                onMouseOut={() => setSelectedGame(null)}
                                style={{ width: '325', margin: 'auto', display: "flex", flexDirection: "column", padding: 5, paddingTop: 15 }}
                                href={`/game?id=${g.embed}`}>
                            <img src={g.cover} style={{ maxWidth: "95%" }} />
                            <Typography>{g.title}</Typography>
                        </Button>
                    </div>)}
                </div>
            </Root>
        </React.Fragment>
    );
};

export default Home;
