import React, {Component} from 'react';
import {Container, Box, Button, Heading, Text, TextField} from "gestalt";
import ToastMessage from "./ToastMessage";
import Strapi from "strapi-sdk-javascript/build/main";

import {setToken} from "../utils";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Signup extends Component {

  state = {
    username: '',
    email: '',
    password: '',
    toast: false,
    toastMessage: '',
    loading: false
  };

  handleChange = ({event, value}) => {
    event.persist();
    this.setState({
      [event.target.name]: value
    })
  };

  handleSubmit = async event => {
    event.preventDefault();
    const {username, email, password} = this.state;
    if(this.isFormEmpty(this.state)){
      this.showToast('Fill in all fields');
      return;
    }
    try {
      this.setState({loading: true});
      const response = await strapi.register(username, email, password);
      this.setState({loading: false});
      setToken(response.jwt);
      this.redirectUser('/');
    } catch (e) {
      this.setState({loading: false});
      this.showToast(e.message);
    }
  };

  redirectUser = path => this.props.history.push(path);

  showToast = toastMessage => {
    this.setState({
      toast: true,
      toastMessage
    });
    setTimeout(() => this.setState({toast: false, toastMessage: ''}), 1000);
  };

  isFormEmpty = ({ username, email, password }) => {
    return !username || !email || !password
  };

  render() {

    const {toastMessage, toast, loading} = this.state;

    return (
        <Container>
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: '#ebe2da'
              }
            }}
            margin={4}
            padding={4}
            shape="rounded"
            display="flex"
            justifyContent="center"
          >
            {/*Sign Up Form*/}
            <form
                style={{
                  display: 'inlineBlock',
                  textAlign: 'center',
                  maxWidth: '450px'
            }}
                onSubmit={this.handleSubmit}
            >
              <Box
                marginBottom={2}
                display="flex"
                direction="column"
                alignItems="center"
              >
                <Heading color="midnight">Let's get started</Heading>
                <Text italic color="orchid">Sign up to order some brews!</Text>
              </Box>
              {/*Username inputs*/}
              <TextField
                id="username"
                onChange={this.handleChange}
                type="text"
                name="username"
                placeholder="Username"
              />
              <TextField
                  id="email"
                  onChange={this.handleChange}
                  type="email"
                  name="email"
                  placeholder="Email Address"
              />
              <TextField
                  id="password"
                  onChange={this.handleChange}
                  type="password"
                  name="password"
                  placeholder="Password"
              />
              <Button disabled={loading} text="submit" type="submit" inline color="blue"/>
            </form>
          </Box>
          <ToastMessage show={toast} message={toastMessage}/>
        </Container>
    );
  }
}

export default Signup;