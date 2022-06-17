import React, {useState} from "react";
import styled from "styled-components";
import axios from "axios";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Col,
    Container,
    FormInput,
    Row
} from "shards-react";
import {Form, FormLabel} from "react-bootstrap";

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

export default function SelectZipPage({updateStatus, updateZIP}) {
    // zipcode that is being searched
    const [zip, setZip] = useState(null);
    const [error, setError] = useState(null);
    const [valid, setValid] = useState(false);

    function validate(inputZip) {
        setValid(/^[0-9]{5}$/.test(inputZip))
    }

    // Called upon search button pressing
    let submit = (ev) => {
        // this prevents the form from doing anything.. not really useful here I don't think
        ev.preventDefault();

        if (!valid) {
            return;
        }

        // backend data requests for this zip
        axios.post(`/api/respondent/zip`, {
            zip
        }, {
            withCredentials: true
        }).then(res => {
            updateStatus(res.data.state);
            updateZIP(res.data.zip);
        }).catch(err => {
            console.log(err);
            setError((err.response && err.response.data.error) || err.message);
        });
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Form onSubmit={submit}>
                        <Card>
                            <CardHeader>
                                Enter ZIP
                            </CardHeader>
                            <CardBody>
                                <CardTitle>Neighborhood Explorer</CardTitle>
                                <p>Awesome! Let's get started.</p>
                                <p>We're going to show you houses in your community. Please enter your 5-digit ZIP
                                    code.</p>
                                <FormLabel>
                                    <b>Your ZIP Code</b>
                                </FormLabel>
                                <FormInput
                                    placeholder={"e.g. 12345"}
                                    value={zip}
                                    onChange={e => {
                                        setZip(e.target.value);
                                        setError(null);
                                        validate(e.target.value);
                                    }}
                                    invalid={!valid}
                                />
                                <small>This information cannot be traced back to you.</small>
                            </CardBody>
                            <CardFooter>
                                <Button
                                    disabled={!valid}
                                    onClick={submit}
                                >Continue</Button>
                            </CardFooter>
                            <Alert
                                dismissible={() => {
                                    setError(null);
                                }}
                                open={!!error}
                                theme={"danger"}
                            >
                                {error}
                            </Alert>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </Container>
    )

    // return (
    //     <LandingBase>
    //         <div>
    //             <DescriptionStyle>
    //                 We are now going to show you houses in your community. Please enter
    //                 your zip code.
    //             </DescriptionStyle>
    //             <ErrorBase error={error}/>
    //             <SearchBar>
    //                 <FormInput
    //                     id={"zip"}
    //                     placeholder="ZIP Code"
    //                     onChange={(e) => {
    //                         setZip(e.target.value);
    //                         setError(null);
    //                     }}
    //                     value={zip}
    //                 />
    //                 <FormButton onClick={onSubmit}>Search</FormButton>
    //             </SearchBar>
    //         </div>
    //     </LandingBase>
    // );
};
