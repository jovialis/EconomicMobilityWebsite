import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {HouseCardList} from "../../components/housecardlist";
import GoogleMapCard from "../../components/googleMapCard";
import axios from "axios";
import ErrorBase from "../../components/error";
import {
    Card,
    CardBody,
    CardColumns,
    CardImg,
    CardTitle,
    ModalHeader,
    Col,
    Container,
    Modal,
    ModalBody,
    Row,
    ModalFooter, Button, Alert, CardHeader, CardFooter, Collapse, Badge, CardSubtitle
} from "shards-react";
import HouseCard from "../../components/houseCard";

const CardMargins = styled.div`
    margin-bottom: 2rem;
`

function NextStateButton({nextState, setRatingStatus, valid}) {
    return (
        <Button
            outline={!valid}
            theme={"success"}
            block
            disabled={!valid}
            style={{
                marginBottom: "1rem"
            }}
            onClick={(e) => {
                e.preventDefault();
                setRatingStatus(nextState);
            }}
        >
            {valid ? "Continue" : "Explore All Houses to Continue"}
        </Button>
    )
}

export default function ExploreOptions ({setRatingStatus, houses, nextState}) {
    // Show intro modal
    const [showTutorial, setShowTutorial] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);

    // What houses we've looked at
    const [visitedHouses, setVisitedHouses] = useState([]);
    const [curHouse, setCurHouse] = useState(null);

    function showHouseDetails(house) {
        // Mark the house as visited if it isn't already
        const houseIndex = house.index;
        if (!visitedHouses.includes(houseIndex)) {
            setVisitedHouses([...visitedHouses, houseIndex]);
        }

        // Set the current house
        setCurHouse(house);
    }

    function isVisited(house) {
        const index = house.index;
        return visitedHouses.includes(index);
    }

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <NextStateButton
                        nextState={nextState}
                        setRatingStatus={setRatingStatus}
                        valid={visitedHouses.length === houses.length}
                    />
                </Col>
                <Col xs={12}>
                    <CardMargins>
                        <Button
                            theme={"light"}
                            block
                            onClick={() => setShowInstructions(!showInstructions)}
                            style={{
                                borderRadius: `.25rem .25rem ${ showInstructions ? "0 0" : ".25rem .25rem" }`
                            }}
                        >
                            Instructions
                        </Button>
                        <Collapse open={showInstructions}>
                            <Card
                                outline={true}
                                style={{
                                    boxShadow: "none",
                                    border: "1px solid #ebebeb",
                                    borderRadius: "0 0 .625rem .625rem"
                                }}
                            >
                                <CardBody>
                                    <CardTitle>Instructions</CardTitle>
                                    <ul style={{marginBottom: 0}}>
                                        <li>
                                            Look at all of the houses.
                                        </li>
                                        <li>
                                            View their interiors by clicking <Badge>View More Photos &rarr;</Badge> under each house, or by selecting them on the map.
                                        </li>
                                    </ul>
                                </CardBody>
                                <CardFooter>
                                    Once you have explored all of the houses in your neighborhood, you will be able to <Badge theme={"success"}>Continue</Badge>.
                                </CardFooter>
                            </Card>
                        </Collapse>
                    </CardMargins>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <h4>Your Neighborhood</h4>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <CardMargins>
                        <GoogleMapCard houses={houses} showHouseDetails={showHouseDetails}/>
                    </CardMargins>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <h4>Houses</h4>
                </Col>
            </Row>
            <Row>
                {houses.map(h => (
                    <Col sm={6} lg={3}>
                        <CardMargins>
                            <HouseCard house={h} showHouseDetails={showHouseDetails} visited={isVisited(h)}/>
                        </CardMargins>
                    </Col>
                ))}
            </Row>
            <Row>
                <Col xs={12}>
                    <div style={{
                        marginTop: "1rem"
                    }}>
                        <NextStateButton
                            nextState={nextState}
                            setRatingStatus={setRatingStatus}
                            valid={visitedHouses.length === houses.length}
                        />
                    </div>
                </Col>
            </Row>
            <Modal size={"lg"} open={!!curHouse} toggle={() => setCurHouse(null)} backdrop className={"modal-dialog-scrollable"} >
                {!!curHouse && (
                    <React.Fragment>
                        <CardHeader>
                            <CardTitle>
                                ${curHouse.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </CardTitle>
                            <CardSubtitle style={{
                                margin: 0,
                                "margin-bottom": "1rem"
                            }}>
                                {curHouse.address.replace(/-/g, " ")}
                            </CardSubtitle>
                            <p style={{
                                "font-size": "80%",
                                marginBottom: 0
                            }}>
                                {curHouse.bedrooms} bd | {curHouse.bathrooms} ba | {curHouse.sqft} sqft
                            </p>
                        </CardHeader>
                        <ModalBody>
                            <Container>
                                <Row>
                                    {curHouse.photos.map(p => {
                                        const url = p.replace('/images/', 'https://zillowprojs3.s3.us-east-2.amazonaws.com/');
                                        return <Col>
                                            <CardMargins>
                                                <Card>
                                                    <CardImg src={url} style={{ objectFit: "cover" }}/>
                                                </Card>
                                            </CardMargins>
                                        </Col>
                                    })}
                                </Row>
                            </Container>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={() => setCurHouse(null)}>Close</Button>
                        </ModalFooter>
                    </React.Fragment>
                )}
            </Modal>
            <Modal size={"lg"} open={showTutorial} backdrop>
                <ModalHeader>Welcome to Your Neighborhood!</ModalHeader>
                <ModalBody>
                    <p>
                        To get started, please <b>look at all of the houses.</b> You must also <b>explore the interiors</b> of the houses by clicking <Badge>View More Photos &rarr;</Badge> under each house, or by selecting them on the map.
                    </p>
                    <p style={{marginBottom: 0}}>
                        Once you have explored all of the houses in your neighborhood, you will be able to <Badge theme={"success"}>Continue</Badge>.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setShowTutorial(false)}>Explore &rarr;</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}