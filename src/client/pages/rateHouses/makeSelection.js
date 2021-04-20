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
    ModalFooter, Button, Alert, CardHeader, CardFooter, Collapse, Badge, CardSubtitle, FormCheckbox
} from "shards-react";
import HouseCard from "../../components/houseCard";
import {func} from "prop-types";
import {Image} from "react-bootstrap";

const CardMargins = styled.div`
    margin-bottom: 2rem;
`

function NextStateButton({nextState, setRatingStatus, valid, selectedHouse, setSelection, finalSelection}) {
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
                setSelection(selectedHouse);
                setRatingStatus(nextState);
            }}
        >
            {finalSelection ? "Finish" : valid ? "Continue" : "Complete Selection to Continue"}
        </Button>
    )
}

export default function MakeSelection({setRatingStatus, houses, nextState, prompt, setSelection, itemPrompt, excludeHouses, finalSelection}) {
    // Exclude certain houses that have already been picked
    const excludedHousesIndexes = (excludeHouses || []).map(h => h.index);
    houses = houses.filter(h => !excludedHousesIndexes.includes(h.index));

    // Show intro modal
    const [showTutorial, setShowTutorial] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);

    // What house we're currently looking at
    const [curHouse, setCurHouse] = useState(null);

    // What house we've selected
    const [selectedHouse, setSelectedHouse] = useState(null);

    function isToggled(house) {
        return selectedHouse && selectedHouse.address === house.address;
    }

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <NextStateButton
                        nextState={nextState}
                        setRatingStatus={setRatingStatus}
                        valid={!!selectedHouse}
                        selectedHouse={selectedHouse}
                        setSelection={setSelection}
                        prompt={prompt}
                        finalSelection={finalSelection}
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
                                            {prompt} by clicking <span style={{
                                                display: "inline-block",
                                                fontWeight: "bold"
                                            }}
                                        ><FormCheckbox toggle checked={false} small>{itemPrompt}</FormCheckbox></span>.
                                        </li>
                                    </ul>
                                </CardBody>
                                <CardFooter>
                                    Once you have picked, you will be able to <Badge theme={"success"}>Continue</Badge>.
                                </CardFooter>
                            </Card>
                        </Collapse>
                    </CardMargins>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <h4>{prompt}</h4>
                </Col>
            </Row>
            <Row>
                {houses.map(h => (
                    <Col sm={6} lg={3}>
                        <CardMargins>
                            <HouseCard
                                house={h}
                                showHouseDetails={setCurHouse}
                                visited={false}
                                toggle={setSelectedHouse}
                                toggleLabel={itemPrompt}
                                isToggled={isToggled(h)}
                            />
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
                            valid={!!selectedHouse}
                            selectedHouse={selectedHouse}
                            setSelection={setSelection}
                            prompt={prompt}
                            finalSelection={finalSelection}
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
                            <div
                                style={{
                                    marginRight: "auto"
                                }}
                            >
                                <FormCheckbox
                                    toggle
                                    checked={isToggled(curHouse)}
                                    onChange={() => setSelectedHouse(curHouse)}
                                >
                                    <b>{itemPrompt}</b>
                                </FormCheckbox>
                            </div>
                            <Button onClick={() => setCurHouse(null)}>Close</Button>
                        </ModalFooter>
                    </React.Fragment>
                )}
            </Modal>
            <Modal size={"lg"} open={showTutorial} backdrop>
                <ModalHeader>
                    {prompt}
                </ModalHeader>
                <ModalBody>
                    <p>
                        To get started, please <b>look at all of the houses again.</b>
                    </p>
                    <p style={{marginBottom: 0}}>
                        {prompt} by clicking <span style={{
                            display: "inline-block",
                            fontWeight: "bold"
                        }}><FormCheckbox toggle checked={false} small>{itemPrompt}</FormCheckbox></span>.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setShowTutorial(false)}>Explore &rarr;</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}