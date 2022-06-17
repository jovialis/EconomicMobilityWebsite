import React, {useEffect, useState} from "react";
import styled from "styled-components";

import {
    Card,
    CardBody,
    CardColumns,
    CardImg,
    CardTitle,
    ModalHeader,
    Col,
    Container,
    ModalBody,
    Row,
    ModalFooter, Button, Alert, CardHeader, CardFooter, Collapse, Badge, CardSubtitle, FormCheckbox
} from "shards-react";
import HouseCard from "../../components/houseCard";
import {func} from "prop-types";
import {Image} from "react-bootstrap";
import {Modal, ModalDialog} from "react-bootstrap";

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

export default function MakeSelection({
                                          setRatingStatus,
                                          houses,
                                          nextState,
                                          prompt,
                                          setSelection,
                                          itemPrompt,
                                          excludeHouses,
                                          finalSelection
                                      }) {
    // Exclude certain houses that have already been picked
    const excludedHousesIndexes = (excludeHouses || []).map(h => h.index);
    houses = houses.filter(h => !excludedHousesIndexes.includes(h.index));

    // Show intro modal
    const [showTutorial, setShowTutorial] = useState(true);

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
                        <Card
                            outline={true}
                            style={{
                                boxShadow: "none",
                                border: "1px solid #ebebeb"
                            }}
                        >
                            <CardBody>
                                <CardTitle>Instructions</CardTitle>
                                <ul style={{marginBottom: 0}}>
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
                    <Col xs={12} sm={6} lg={4} xl={3}>
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
            <Modal
                size={"lg"}
                show={!!curHouse}
                onHide={() => setCurHouse(null)}
                backdrop
                scrollable
            >
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
                        <ModalBody style={{
                            maxHeight: 'calc(100vh - 300px)',
                            overflowY: 'auto'
                        }}>
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
            <Modal size={"lg"} show={showTutorial} backdrop>
                <ModalHeader>
                    {prompt}
                </ModalHeader>
                <ModalBody>
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