import { useState } from "react"
import Button from "../components/button"
import Cardroom from "./cardroom"
import io from "socket.io-client"
import './joinGame.css'

const socket = io('http://localhost:8080')


const JoinGame = () => {

    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [welcome, setWelcome] = useState(false);

    const joinRoom = () => {
        if (username !== "" && room !== "" && !welcome) {
            socket.emit("join_room", room, username);
            setWelcome(true);
        }
    };


    return (
        <div className='container'>
            {!welcome ? (
                <div>
                    <div className="button-wrapper">
                        <input type="text" name="username" placeholder="Enter your name" onChange= {(event) => {
                            setUsername(event.target.value)
                            }}
                        ></input>
                    </div>

                    <div className="button-wrapper" >
                        <input type="text" name="gameID" placeholder="Game ID" onChange={(event) => {
                            setRoom(event.target.value);
                        }}></input>
                        <Button label='Join Game' click={joinRoom}></Button>
                    </div>
                </div>) : (
                    <Cardroom socket={socket} user={username} room={room}></Cardroom>
                )}
        </div>
    )
}
export default JoinGame