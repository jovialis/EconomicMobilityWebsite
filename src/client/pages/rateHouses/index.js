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
import {func} from "prop-types";
import {Image} from "react-bootstrap";
import ExploreOptions from "./exploreOptions";
import MakeSelection from "./makeSelection";

/*************************************************************************/

const CardMargins = styled.div`
    margin-bottom: 2rem;
`

export default function RateHouses ({updateStatus}) {
    // full search results for houses within the zip code
    const [houses, setHouses] = useState(null);

    // Rankings
    const [favoriteHouse1, setFavoriteHouse1] = useState(null);
    const [favoriteHouse2, setFavoriteHouse2] = useState(null);
    const [worstHouse2, setWorstHouse2] = useState(null);
    const [worstHouse1, setWorstHouse1] = useState(null);

    // Page status
    const [ratingStatus, updateRatingStatus] = useState("explore");

    function setRatingStatus(status) {
        window.scrollTo(0, 0);
        updateRatingStatus(status);
    }

    // Error
    const [error, setError] = useState(null);

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
            setError((err.response && err.response.data.error) || err.message);
        });
    }, []);

    // Update the partials when the partial ratings come in
    useEffect(() => {
        if (!favoriteHouse1) {
            return;
        }

        // Backend data request to update the favorite house.
        axios.post('/api/rating/partial', {
            key: 'bestAddress1',
            value: favoriteHouse1.address
        }).then(res => {
            console.log('Saved partial best address 1');
        }).catch(console.log);
    }, [favoriteHouse1]);


    // Update the partials when the partial ratings come in
    useEffect(() => {
        if (!favoriteHouse2) {
            return;
        }

        // Backend data request to update the favorite house.
        axios.post('/api/rating/partial', {
            key: 'bestAddress2',
            value: favoriteHouse2.address
        }).then(res => {
            console.log('Saved partial best address 2');
        }).catch(console.log);
    }, [favoriteHouse2]);


    // Update the partials when the partial ratings come in
    useEffect(() => {
        if (!worstHouse2) {
            return;
        }

        // Backend data request to update the favorite house.
        axios.post('/api/rating/partial', {
            key: 'worstAddress2',
            value: worstHouse2.address
        }).then(res => {
            console.log('Saved partial worst address 2');
        }).catch(console.log);
    }, [worstHouse2]);


    // Update the partials when the partial ratings come in
    useEffect(() => {
        if (!worstHouse1) {
            return;
        }

        // Backend data request to update the favorite house.
        axios.post('/api/rating/partial', {
            key: 'worstAddress1',
            value: worstHouse1.address
        }).then(res => {
            console.log('Saved partial worst address 1');
        }).catch(console.log);
    }, [worstHouse1]);

    function submit() {
        if (!favoriteHouse1 || !favoriteHouse2 || !worstHouse1 || !worstHouse2) {
            return;
        }

        const data = {
            bestAddress1: favoriteHouse1.address,
            bestAddress2: favoriteHouse2.address,
            worstAddress2: worstHouse2.address,
            worstAddress1: worstHouse1.address
        };

        console.log(data);

        axios.post('/api/rating', data, {
            withCredentials: true
        }).then(res => {
            updateStatus(res.data.state);
        }).catch(err => {
            console.log(err);
            setError((err.response && err.response.data.error) || err.message);
        });
    }

    function generateRatingStatus() {
        switch (ratingStatus) {
            case "explore":
                return <ExploreOptions
                    key={0}
                    houses={houses}
                    setRatingStatus={setRatingStatus}
                    nextState={"rateBest1"}
                />;

            case "rateBest1":
                return <MakeSelection
                    key={1}
                    houses={houses}
                    setRatingStatus={setRatingStatus}
                    prompt={"Select Your Favorite House"}
                    setSelection={setFavoriteHouse1}
                    itemPrompt={"Favorite"}
                    nextState={"rateBest2"}
                />;

            case "rateBest2":
                return <MakeSelection
                    key={2}
                    houses={houses}
                    setRatingStatus={setRatingStatus}
                    prompt={"Select Your Second-Favorite House"}
                    setSelection={setFavoriteHouse2}
                    itemPrompt={"Second Favorite"}
                    nextState={"rateWorst1"}
                    excludeHouses={[favoriteHouse1]}
                />;

            case "rateWorst1":
                return <MakeSelection
                    key={3}
                    houses={houses}
                    setRatingStatus={setRatingStatus}
                    prompt={"Select Your Least-Favorite House"}
                    setSelection={setWorstHouse1}
                    itemPrompt={"Least-Favorite"}
                    nextState={"rateWorst2"}
                    excludeHouses={[favoriteHouse1, favoriteHouse2]}
                />;

            case "rateWorst2":
                return <MakeSelection
                    key={4}
                    houses={houses}
                    setRatingStatus={setRatingStatus}
                    prompt={"Select Your Second Least-Favorite House"}
                    setSelection={setWorstHouse2}
                    itemPrompt={"Second Least-Favorite"}
                    nextState={"done"}
                    excludeHouses={[favoriteHouse1, favoriteHouse2, worstHouse1]}
                />;

            case "done":
                submit();
                return <React.Fragment/>

            default:
                return <React.Fragment/>
        }
    }

    return (
        <React.Fragment>
            <Alert
                dismissible={() => {
                    setError(null);
                }}
                open={!!error}
                theme={"danger"}
            >
                {error}
            </Alert>
            {!!houses && (
                generateRatingStatus()
            )}
        </React.Fragment>
    )
}

