/**
 * Created on 4/17/21 by jovialis (Dylan Hanson)
 **/

import React from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader, CardSubtitle,
    CardTitle,
    Col,
    Container,
    Form,
    FormInput,
    Row
} from "shards-react";
import {FormLabel} from "react-bootstrap";

export default function CompletedPage({}) {
    return (
        <Container>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            Finished
                        </CardHeader>
                        <CardBody>
                            <CardTitle>Thank You!</CardTitle>
                            <CardSubtitle style={{
                                marginTop: 0
                            }}>You have completed Neighborhood Explorer. We hope it was a blast!</CardSubtitle>
                            <p style={{
                                marginTop: "1rem"
                            }}>You may now return to the survey.</p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}