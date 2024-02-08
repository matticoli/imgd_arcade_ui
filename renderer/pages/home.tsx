import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import React, { useState } from 'react';

import useInput from "../components/GamepadAPI";

const Root = styled('div')(({ theme }) => {
    return {
        textAlign: 'center',
        paddingTop: theme.spacing(4),
    };
})

const games = [0];


function Home() {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleClick = () => setOpen(true);
    const [selectedGame, setSelectedGame] = useState(null);

    const { inputState, keyboard, gamepad } = useInput({
        "left": { keyCode: "ArrowLeft" },
        "right": { keyCode: "ArrowRight" },
        "up": { keyCode: "ArrowUp" },
        "down": { keyCode: "ArrowDown" },
        "home": { keyCode: "Esc" },
        "a": { keyCode: "j", buttonIndex: 3 },
        "b": { keyCode: "k", buttonIndex: 1 },
        "x": { keyCode: "l", buttonIndex: 2 },
    }, (evt) => {
        console.log(evt);
    }, false);

    return (
        <React.Fragment>
            <Head>
                <title>IMGD Arcade</title>
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
                <div style={{ display: "grid", columnCount: 4, gap: 20, alignContent: "center" }}>
                    {games.map(g => <div key={g} style={{ maxWidth: "25%"}}>
                        <Button variant="contained" style={{width: '325', margin: 'auto', display: "flex", flexDirection: "column", padding: 5, paddingTop: 15 }} href={`/game/${g}`}>
                            <img src="https://img.itch.zone/aW1nLzEyNzM0MDI2LnBuZw==/315x250%23c/%2BKpN4e.png" />
                            <Typography>Elephant in the Room</Typography>
                        </Button>
                    </div>)}
                </div>
            </Root>
        </React.Fragment>
    );
};

export default Home;
