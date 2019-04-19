import React from 'react';
import { NavLink } from "react-router-dom";
import { Box, Text, Heading, Image } from "gestalt";

const Navbar = () => {
  return (
      <Box
          display="flex"
          alignItems="center"
          justifyContent="around"
          height={70}
          color="midnight"
          padding={1}
          shape="roundedBottom"
      >

        <NavLink to="/signin" activeClassName="active">
          <Text size="xl" color="white">Sign In</Text>
        </NavLink>

        <NavLink to="/" activeClassName="active" exact>
          <Box
              display="flex"
              alignItems="center"
          >
            <Box height={50} width={50} margin={2}>
                <Image
                    naturalHeight={1}
                    src="./icons/logo.svg"
                    naturalWidth={1}
                    alt="BrewHaha Logo"
                />
            </Box>
            <Heading size='xs' color="orange">
              BrewHaha
            </Heading>
          </Box>
        </NavLink>

        <NavLink to="/signup" activeClassName="active">
          <Text size="xl" color="white">Sign Up</Text>
        </NavLink>
      </Box>
  );
};

export default Navbar;