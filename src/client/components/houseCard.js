/**
 * Created on 4/19/21 by jovialis (Dylan Hanson)
 **/

import {Button, Card, CardBody, CardFooter, CardImg, CardSubtitle, CardTitle} from "shards-react";
import React from "react";
import styled from "styled-components";

const ClickableCard = styled.div`
  &:hover {
    cursor: pointer;
  }
`

export default function HouseCard({showHouseDetails, house, visited}) {
    let { address, price, photos, bedrooms, bathrooms, sqft, lat, lng, index } = house;

    address = address.replace(/-/g, " ");
    const thumbnail = photos[0].replace(
        "/images/",
        "https://zillowprojs3.s3.us-east-2.amazonaws.com/"
    );

    return (
        <Card>
            <CardImg
                style={{
                    height: "13rem",
                    width: "auto",
                    "object-fit": "cover"
                }}
                top
                src={thumbnail}
            />
            <CardBody>
                <CardTitle>
                    ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </CardTitle>
                <CardSubtitle style={{
                    margin: 0,
                    "margin-bottom": "1rem"
                }}>
                    {address}
                </CardSubtitle>
                <p style={{
                    "font-size": "80%",
                    marginBottom: 0
                }}>
                    {bedrooms} bd | {bathrooms} ba | {sqft} sqft
                </p>
                <div style={{
                    position: "absolute",
                    backgroundColor: "white",
                    left: "10%",
                    top: "5%",
                    borderRadius: "100%",
                    width: "2rem",
                    height: "2rem",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 500,
                    color: "black",
                    border: "1px solid darkgrey"
                }}>
                    {index}
                </div>
            </CardBody>
            <CardFooter>
                <Button
                    size={"sm"}
                    onClick={() => showHouseDetails(house)}
                    theme={visited ? "light" : "primary"}
                >
                    View More Photos {visited ? "✅" : "→"}
                </Button>
            </CardFooter>
        </Card>
    );
}