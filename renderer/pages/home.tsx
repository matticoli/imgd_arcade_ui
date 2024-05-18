import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import useInput from "../components/GamepadAPI";
import { db } from '../lib/fb';
import { useRouter } from 'next/router';
import { collection, getDocs, query } from 'firebase/firestore';

const isProd: boolean = process.env.NODE_ENV === 'production';

const Root = styled('div')(({ theme }) => {
    return {
        textAlign: 'center',
        paddingTop: theme.spacing(4),
    };
})

const gameUrl = (embed: string) => {
    return isProd ? `app://./game.html?embed=${embed}` : `/game?embed=${embed}`;
}

function Home() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleClick = () => setOpen(true);
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [evt, setEvt] = useState({ key: "", value: -1 });


    useEffect(() => {
        const q = query(collection(db, "/games"));
        getDocs(q).then((docs) => {
            const fetchedGames = docs.docs.map(doc => doc.data());
            setGames(fetchedGames);
        });
    }, []);

    const selectGame = (game) => {
        setSelectedGame(game);
        try {
            document.getElementById(`game-${game.embed}`).focus();
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        // Button down
        if (Math.abs(evt.value) == 1) {
            if ((evt.key == "k" || evt.key == "l") && !!selectedGame) {
                window.location.href = gameUrl(selectedGame.embed);
            } else if (evt.key == "down" || (evt.key == "ay" && evt.value > 0)) {
                if (!!selectedGame) {
                    const index = games.indexOf(selectedGame) + 3;
                    selectGame(games[index >= games.length ? index % 3 : index]);
                } else {
                    selectGame(games[0]);
                }
            } else if (evt.key == "right" || (evt.key == "ax" && evt.value > 0)) {
                if (!!selectedGame) {
                    const index = games.indexOf(selectedGame) + 1;
                    selectGame(games[index >= games.length ? 0 : index]);
                } else {
                    selectGame(games[0]);
                }
            } else if (evt.key == "left" || (evt.key == "ax" && evt.value < 0)) {
                if (!!selectedGame) {
                    const index = games.indexOf(selectedGame) - 1;
                    selectGame(games[index < 0 ? games.length - 1 : index]);
                } else {
                    selectGame(games[games.length - 1]);
                }
            } else if (evt.key == "up" || (evt.key == "ay" && evt.value < 0)) {
                if (!!selectedGame) {
                    const index = games.indexOf(selectedGame) - 3;
                    selectGame(games[index < 0 ? (games.length + (3 - (games.length % 3))) + index : index]);
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
        "home": { keyCode: "Escape", buttonIndex: 11 },
        "j": { keyCode: "j", buttonIndex: 3 },
        "k": { keyCode: "k", buttonIndex: 4 },
        "l": { keyCode: "l", buttonIndex: 1 },
    }, (evt) => {
        console.log(evt);
        setEvt(evt);
    }, true);

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
                    <img height="250" src="/images/imgd.png" />
                    <img height="220" style={{ borderRadius: 5 }} src="/images/qr-code.png" />
                    <img height="240" src="/images/joybox.png" />
                </div>
                <div style={{ background: "black", width: "100%", paddingTop: 15, paddingBottom: 5 }}>
                    <Typography variant="h3" gutterBottom>
                        IMGD Arcade <sup style={{ fontSize: 20 }}>v0.3</sup>
                    </Typography>
                </div>
                <br />
                <Typography variant="subtitle1" gutterBottom>
                    Add your games at:  https://imgdhub.wpi.edu/app/arcade
                </Typography>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyContent: "center", alignItems: "center" }}>
                    {loading && <div className='lds-dual-ring'></div>}
                    {games.map(g => {

                        const canvas2d = document.createElement("canvas").getContext('2d');
                        const cover = document.createElement("img");
                        cover.crossOrigin = "Anonymous";
                        // document.body.append(cover)
                        cover.src = g.cover;
                        canvas2d.drawImage(cover, 0, 0);
                        const rgb = canvas2d.getImageData(0, 0, 1, 1).data;

                        const coverColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

                        return <div key={g.embed} style={{ width: "100%", minHeight: 400, padding: "5%" }}>
                            <Button variant="contained"
                                color={selectedGame && g.embed == selectedGame.embed ? "secondary" : "primary"}
                                id={`game-${g.embed}`}
                                onMouseOver={() => setSelectedGame(g)}
                                onMouseOut={() => setSelectedGame(null)}
                                style={{ display: "flex", flexDirection: "column", gap: 15, padding: 15, paddingTop: 15, paddingBottom: 15 }}
                                href={gameUrl(g.embed)}>
                                <span style={{
                                    width: "100%",
                                    height: 325,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    backgroundImage: `url(${g.cover})`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundColor: "#121212",
                                }} />
                                <Typography>{g.title}</Typography>
                            </Button>
                        </div>
                    }
                    )}
                    {games.length <= 0 && <Typography variant="h5">
                        <br /><br />
                        No Games Available
                        <br /><br />
                        Want to add your own? Check out the link or QR code above!
                    </Typography>}
                </div>
            </Root>
        </React.Fragment>
    );
};

export default Home;
