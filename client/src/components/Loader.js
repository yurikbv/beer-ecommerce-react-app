import React from 'react';
import { GridLoader } from "react-spinners";
import {Box} from "gestalt";

const Loader = ({show}) => (
    show &&
    <Box
      position="fixed"
      dangerouslySetInlineStyle={{
        __style: {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)'
        }
      }}
    >
      <GridLoader color="darkorange" size={25} margin="3px"/>
    </Box>
);

export default Loader;