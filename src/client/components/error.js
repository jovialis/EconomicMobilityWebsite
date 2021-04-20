/**
 * Created on 4/17/21 by jovialis (Dylan Hanson)
 **/

import React from "react";
import styled from "styled-components";

const Error = styled.div`
  width: 100%;
  height: 5%;
  background-color: red;
`;

export default function ErrorBase ({error}) {
    return <React.Fragment>
        {error && <Error>{error}</Error>}
    </React.Fragment>
};
