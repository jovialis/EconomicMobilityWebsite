/**
 * Created on 4/19/21 by jovialis (Dylan Hanson)
 **/

import React from "react";
import CustomMarker from "./custommarker";
import GoogleMapReact from "google-map-react";
import {Card, CardBody} from "shards-react";
import styled from "styled-components";

const GoogleMapBase = styled.div`
  height: 25rem;
  width: 100%;
`;

export default function GoogleMapCard({houses, showHouseDetails}) {

    let nwLat = houses.reduce((a, v) => Math.max(a, v.lat), Number.NEGATIVE_INFINITY);
    let nwLng = houses.reduce((a, v) => Math.max(a, v.lng), Number.NEGATIVE_INFINITY);
    let seLat = houses.reduce((a, v) => Math.min(a, v.lat), Number.POSITIVE_INFINITY);
    let seLng = houses.reduce((a, v) => Math.min(a, v.lng), Number.POSITIVE_INFINITY);

    const center = {
        lat: (nwLat + seLat) / 2,
        lng: (nwLng + seLng) / 2
    };

    return (
        <Card style={{
            overflow: "hidden"
        }}>
            <CardBody style={{
                padding: 0
            }}>
                <GoogleMapBase>
                    {/* // Someone else's component */}
                    <GoogleMapReact
                        bootstrapURLKeys={{key: "AIzaSyCFv04UuNwVEogQyB0CojonVeQu0PNW9GI"}}
                        center={center}
                        defaultZoom={13}
                    >
                        {houses.map(h => (
                            <CustomMarker house={h} showHouseDetails={showHouseDetails} lat={h.lat} lng={h.lng}/>
                        ))}
                    </GoogleMapReact>
                </GoogleMapBase>
            </CardBody>
        </Card>

    );
}