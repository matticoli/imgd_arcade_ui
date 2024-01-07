import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import React from 'react';

import useInput from "../components/GamepadAPI";

const Root = styled('div')(({theme}) => {
    return {
        textAlign: 'center',
        paddingTop: theme.spacing(4),
    };
})


function Home() {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleClick = () => setOpen(true);

    const {inputState, keyboard, gamepad} = useInput({
        "left": {keyCode: "ArrowLeft"},
        "right": {keyCode: "ArrowRight"},
        "up": {keyCode: "ArrowUp"},
        "down": {keyCode: "ArrowDown"},
        "home": {keyCode: "Escape"},
    }, (evt) => {
        console.log("Event handler");
        console.log(evt);
        if(evt.key == 'home' && evt.value == 1) {
            const d = new Date();
            d.setSeconds(d.getSeconds() + 5);
            
        }
    }, true);

    return (
        <React.Fragment>
            <Head>
                <title>IMGD Arcade</title>
            </Head>
            <Root>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: 10, alignContent: "center"}}>
                    <img height="150" src="/images/imgd.png"/>
                    <img height="120" style={{borderRadius: 5}} src="/images/qr-code.png"/>
                    <img height="140" src="/images/joybox.png"/>
                </div>
                <Typography variant="h4" gutterBottom>
                    IMGD Arcade
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    https://imgdhub.wpi.edu/lore/arcade
                </Typography>
                <div style={{display: "flex", flexDirection: "row", margin: 20, gap: 10, alignContent: "center"}}>
                    <Button variant="contained" style={{display: "flex", flexDirection: "column", padding: 5}} href='/game?id=8275100'>
                        <img src="https://img.itch.zone/aW1nLzEyNzM0MDI2LnBuZw==/315x250%23c/%2BKpN4e.png" />
                        <Typography>Elephant in the Room</Typography>
                    </Button>
                </div>
            </Root>
        </React.Fragment>
    );
};

export default Home;
