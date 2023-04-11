import React from "react";
import './Message.css';



function Message(props)
{
    return(
        <>
            {
                props.sender === 'assistant'?  (<div id="messageContainer"><div id="message"><p>{props.text}</p></div></div>):
                (<div id="messageContainer_user"><div id="message_user"><p>{props.text}</p></div></div>)
            }
        </>
    );
}

export default Message;