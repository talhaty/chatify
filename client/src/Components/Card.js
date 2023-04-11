import React from "react";
import './Card.css';




function Card(props)
{
    return(
        <>
        <div id="card">
            <h1>{props.package}</h1>
            <p>{props.reqs}</p>
            <p>Answers limited to {props.tokens}</p>
            <p>{props.daily}</p>
            <p>{props.monthly}</p>
        </div>
        </>
    );
}

export default Card;