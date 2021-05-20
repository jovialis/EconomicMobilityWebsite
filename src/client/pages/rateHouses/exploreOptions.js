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
                        <Card
                            outline={true}
                            style={{
                                boxShadow: "none",
                                border: "1px solid #ebebeb",
                            }}
                        >
                            <CardBody>
                                <CardTitle>Instructions</CardTitle>
                                <ul style={{marginBottom: 0, fontSize: "1.5rem"}}>
                                    <li>
                                        Please look at all of the houses.
                                    </li>
                                    <li>
                                        <b><span style={{color: "red"}}>You have to view the interiors of each and every house</span><b/> by clicking <Badge>View More Photos &rarr;</Badge> or by selecting it on the map.</b>
                                    </li>
                                    <li>
                                        <b>You will not be compensated unless you complete this task.</b>
                                    </li>
                                </ul>
                            </CardBody>
                            <CardFooter>
                                <b>YOU MUST EXPLORE ALL OF THE HOUSES BEFORE YOU WILL BE ABLE TO <Badge theme={"success"}>Continue</Badge>.</b>
                            </CardFooter>
                        </Card>
                    </CardMargins>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <h4>Neighborhood Map</h4>
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
                    <Col xs={12} sm={6} lg={4} xl={3}>
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
                <ModalHeader>Welcome to The Neighborhood!</ModalHeader>
                <ModalBody>
                    <span style={{fontSize: "1.5rem"}}>
                        <p>
                            To get started, please <b>look at all of the houses.</b>
                        </p>
                        <p >
                            <b><span style={{color: "red"}}>You have to view the interiors of each and every house</span></b> by clicking <Badge>View More Photos &rarr;</Badge> or by selecting it on the map. You will not be compensated unless you complete this task.
                        </p>
                        <p style={{marginBottom: 0}}>
                            <b>YOU MUST EXPLORE ALL THE HOUSES BEFORE YOU WILL BE ABLE TO <Badge theme={"success"}>Continue</Badge>.</b>
                        </p>
                    </span>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setShowTutorial(false)}>Explore &rarr;</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}