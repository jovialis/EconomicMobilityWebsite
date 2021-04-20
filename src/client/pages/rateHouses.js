import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {HouseCardList} from "../components/housecardlist";
import GoogleMapCard from "../components/googleMapCard";
import axios from "axios";
import ErrorBase from "../components/error";
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
import HouseCard from "../components/houseCard";
import {func} from "prop-types";
import {Image} from "react-bootstrap";

/*************************************************************************/

const LandingBase = styled.div`
  justify-content: right;
`;

const DescriptionStyle = styled.div`
  position: relative;
  align-content: left;
  text-align: left;
  padding-top: 5px;
  padding-left: 10px;
  color: #191970;
`;

const SearchBar = styled.form`
  display: flex;
  justify-content: right;
  width: 100%;
  height: 5%;
  overflow: hidden;
  padding-top: 45px;
  padding-bottom: 10px;
  padding-left: 5px;
  border-bottom: 1px solid #b8b8b8;
`;

const FormInput = styled.input`
  margin: 5px 5px;
  width: 30%;
  padding-left: 5px;
`;

const FormInput2 = styled.select`
  margin: 5px 5px;
  width: 18vw;
  padding-left: 5px;
`;

const FormButton = styled.button`
  margin: 5px 5px;
  width: 12vw;
  max-height: 3em;
  background: #6495ed;
  border: none;
  border-radius: 5px;
  line-height: 3em;
  font-size: 0.8em;
`;

const ContentRow = styled.div`
  display: flex;
  width: 100%;
  height: 80%;
`;

const Label = styled.div`
  display: flex;
  justify-content: right;
  font-size: 14px;
  height: 6%;
  padding-top: 15px;
  padding-bottom: 10px;
  margin-left: 5px;
`;

const CardMargins = styled.div`
    margin-bottom: 2rem;
`

export const RateHouses = ({updateStatus}) => {
    // full search results for houses within the zip code
    const [houses, setHouses] = useState(null);

    // Show intro modal
    const [showTutorial, setShowTutorial] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);

    // What houses we've looked at
    const [visitedHouses, setVisitedHouses] = useState([]);
    const [curHouse, setCurHouse] = useState(null);

    // boolean for showing a detailed house card
    const [show, setShow] = useState(false);

    // target house for the detailed house card
    const [targetHouse, setTargetHouse] = useState(null);

    // Error for nonexistent zip code
    const [error, setError] = useState(false);

    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [address3, setAddress3] = useState("");
    const [address4, setAddress4] = useState("");

    const [startTime, setStartTime] = useState(null);


    // Load houses when the page is loaded
    useEffect(() => {
        // backend data requests for this zip
        axios.get(`/api/home`, {
            withCredentials: true
        }).then(res => {
            let homes = res.data.homes;
            homes = [...Array(homes.length).keys()].map(k => {
                const home = homes[k];
                home.index = k + 1;
                return home;
            });

            setHouses(homes);
        }).catch(err => {
            console.log(err);
            setError(err.response && err.response.data.error);
        });
    }, []);

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

    if (!houses) {
        return (
            <React.Fragment/>
        )
    }

    return (
        <Container>
            <Row>
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
                                    Once you have explored all of the houses in your neighborhood, you will be able to continue.
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
                        Once you have explored all of the houses in your neighborhood, you will be able to continue.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setShowTutorial(false)}>Explore &rarr;</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}
