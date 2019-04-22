import React from 'react';
import {Toast, Box} from "gestalt";

const ToastMessage = ({show, message}) => (
    show && (
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              left: '50%',
              top: '50%',
              transform: 'translate(-50%,-50%)'
            }
          }}
          position="fixed"
        >
          <Toast text={message} color="orange"/>
        </Box>
    )
);

export default ToastMessage;