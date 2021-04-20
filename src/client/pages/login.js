import React, {useState} from "react";
import styled from "styled-components";
import axios from "axios";
import ErrorBase from "../components/error";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Col,
    Container,
    Form,
    FormGroup,
    FormInput,
    Row,
    Alert
} from "shards-react";
import {FormLabel} from "react-bootstrap";

/*******************************************************************/

const LoginStyle = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  text-align: center;
  width: 100%;
`;

const DescriptionStyle = styled.div`
  position: relative;
  align-content: left;
  text-align: left;
  //width: 50%;
  padding-top: 5px;
  padding-left: 10px;
  color: #191970;
`;

// const FormInput = styled.input`
//   width: 40%;
//   margin: 0.5em 0;
//   padding-left: 5px;
// `;

const FormButton = styled.button`
  max-width: 200px;
  min-width: 150px;
  max-height: 2em;
  background: #6495ed;
  border: none;
  border-radius: 5px;
  line-height: 2em;
  font-size: 0.8em;
`;

const FormBase = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: center;
  // grid-template-columns: 30% 70%;
  // grid-auto-rows: minmax(10px, auto);
  padding: 0.1em;
  margin-top: 40px;
  width: 50%;
  @media (min-width: 500px) {
    padding: 1em;
  }
`;

export default function LoginPage({updateStatus, setRespondent}) {
    // Logs the respondent in then updates the app status
    const [respondentId, setRespondentId] = useState(null);
    const [error, setError] = useState(null);
    const [valid, setValid] = useState(false);

    function validate(respondentId) {
        setValid(/^[0-9]{9}$/.test(respondentId))
    }

    const submit = (ev) => {
        ev.preventDefault();

        if (!valid) {
            return;
        }

        console.log(`Submit the respondentId ${respondentId}, and log the respondent in`);

        axios.post('/api/respondent/login', {
            respondentId
        }, {
            withCredentials: true
        }).then(res => {
            updateStatus(res.data.state);
            setRespondent(res.data.respondent);
        }).catch(err => {
            console.log(err);
            setError((err.response && err.response.data.error) || err.message);
        });
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            Sign In
                        </CardHeader>
                        <CardBody>
                            <CardTitle>Neighborhood Explorer</CardTitle>
                            <p>Welcome! This is part of our housing survey. This platform gives you a chance to explore houses in your neighborhood and tell us your favorite.</p>
                            <p>To continue, please enter the unique, 9-digit ID that was provided to you.</p>
                            <Form>
                                <FormLabel><b>Your 9-Digit ID</b></FormLabel>
                                <FormInput
                                    placeholder={"e.g. 123456789"}
                                    value={respondentId}
                                    onChange={e => {
                                        setRespondentId(e.target.value);
                                        setError(null);
                                        validate(e.target.value);
                                    }}
                                    name="name"
                                    invalid={!valid}
                                />
                            </Form>
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
                </Col>
            </Row>
        </Container>
    )

    // return (
    //     <div>
    //         <DescriptionStyle>
    //             Welcome! This is part of our housing survey. This platform gives you a
    //             chance to explore houses in your neighborhood. Before you proceed,
    //             please enter the unique, 9-digit ID that was given to you.{" "}
    //         </DescriptionStyle>
    //         <ErrorBase error={error}/>
    //         <LoginStyle>
    //             <FormBase>
    //                 <FormInput
    //                     id="respondentId"
    //                     name="respondentId"
    //                     type="text"
    //                     placeholder="Respondent ID"
    //                     value={respondentId}
    //                     onChange={(e) => {
    //                         setRespondentId(e.target.value);
    //                         setError(null);
    //                     }}
    //                 />
    //                 <FormButton onClick={onSubmit}>Login</FormButton>
    //             </FormBase>
    //         </LoginStyle>
    //     </div>
    // );
};
