import React, {useState} from 'react';
import './cardroom.css'
import Button from '../components/button';
import { Slider } from '@mui/material';

const Cardroom = ({socket, user, room}) => {

    const [communityCards, setCommunityCards] = useState([]);
    const [holeCards, setHoleCards] = useState([]);
    const [pot, setPot] = useState(0);
    const [stack, setStack] = useState(0);
    const [action, setAction] = useState("");
    const [bet, setBet] = useState(0);


    socket.on('commCards', (cards) => {
            setCommunityCards(cards);
        })

    socket.on('cards', (cards) => {
        setHoleCards(cards);
    });

    socket.on('pot', (pot) => {
        setPot(pot);
    });

    socket.on('stack', (stack) => {
        setStack(stack);
    });

    const handleBet = () => {
        if (action !== "" && bet !== "") {
            socket.emit("handleMove", action, bet);
        }
    };

    return (
        <div className='container'>
            <div className='table-wrapper'>
                <div className='item'>Community Cards: {communityCards}</div>
                <div className='item'>Pot: {pot}</div>
            </div>
            <div className='player-wrapper'>
                <div className='item'>Player: {user}</div>
                <div className='item'>Hole Cards: {holeCards}</div>
                <div className='item'>Stack: {stack}</div>
                <div className='item'>Room: {room}</div>
                <div className='item'>ID: {socket.id}</div>
            </div>
            <div>
                <div className='button-wrapper'>
                    <Button label='Check' click={() => setAction("check")}></Button>
                    <Button label='Call' click={() => setAction("call")}></Button>
                    <Button label='Call Any' click={() => setAction("call any")}></Button>
                </div>
                <div className='button-wrapper'>
                    <Button label='Check/Fold' click={() => setAction("check/fold")}></Button>
                    <Button label='Raise' click={() => setAction("raise")}></Button>
                    <Button label='Fold' click={() => setAction("fold")}></Button>
                </div>
            </div>
             <div >
                <Slider
                min={0}
                max={100}
                step={1}
                orientation="vertical"
                onChange={(value) =>setBet(value)}
                ></Slider>
                <Button label='Confirm' click={handleBet}></Button>
            </div>
        </div>
    )
}

export default Cardroom;