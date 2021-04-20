import React from 'react';
//import {Marker} from 'react-google-maps';
import styled from "styled-components";

const HoverCursor = styled.div`
&:hover {
  cursor: pointer;
}
`

// This marker is for letting users click on the map and see the house
export default function CustomMarker({house, showHouseDetails}) {

    const onMarkerClick = (e) => {
        e.preventDefault();
        showHouseDetails(house);
    };

    return (
        <HoverCursor>
            <div
                onClick={onMarkerClick}
                style={{
                    color: 'black',
                    fontWeight: 500,
                    background: 'white',
                    border: "1px solid darkgrey",
                    width: "1.3rem",
                    height: "1.3rem",
                    display: 'inline-flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '100%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                {house.index}
            </div>
        </HoverCursor>
    );
}