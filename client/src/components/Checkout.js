import React, {Component} from 'react';
import {Box,Button, Container, Heading, Text, TextField, Modal, Spinner} from "gestalt";
import {Elements, StripeProvider, CardElement, injectStripe} from 'react-stripe-elements';
import { withRouter } from 'react-router-dom';
import ToastMessage from "./ToastMessage";
import {calculatePrice, getCart, clearCart, calculateAmount} from "../utils";
import Strapi from "strapi-sdk-javascript/build/main";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends Component {

  state = {
    cartItems:[],
    address: '',
    postalCode: '',
    city: '',
    confirmationEmailAddress: '',
    toast:false,
    toastMessage: '',
    orderProcessing: false,
    modal: false
  };

  componentDidMount() {
    this.setState({cartItems: getCart()})
  }


  handleChange = ({event, value}) => {
    event.persist();
    this.setState({
      [event.target.name]: value
    })
  };

  handleConfirmOrder = async event => {
    event.preventDefault();
    if(this.isFormEmpty(this.state)){
      this.showToast('Fill in all fields');
      return;
    }
    this.setState({modal: true});
  };

  handleSubmitOrder = async () => {
    const {cartItems, city, address, postalCode} = this.state;
    const amount = calculateAmount(cartItems);
    this.setState({orderProcessing: true});
    let token;
    try {
      const response = await this.props.stripe.createToken();
      token = response.token.id;

      await strapi.createEntry('orders',{
        amount,
        brews: cartItems,
        city,
        postalCode,
        address,
        token
      });
      this.setState({orderProcessing: false, modal: false});
      clearCart();
      this.showToast('Your order has been successfully submitted!', true);
    }catch (e) {
      this.setState({orderProcessing: false, modal: false});
      this.showToast(e.message);
    }
  };

  showToast = (toastMessage,redirect) => {
    this.setState({
      toast: true,
      toastMessage
    });
    setTimeout(() => this.setState({toast: false, toastMessage: ''}, () => {
      redirect && this.props.history.push('/')
    }), 5000);
  };

  closeModal = () =>  this.setState({ modal: false});

  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress
  };

  render() {

    const {toast, toastMessage, cartItems, modal, orderProcessing} = this.state;

    return (
        <Container>
          <Box
              color="darkWash"
              margin={4}
              padding={4}
              shape="rounded"
              display="flex"
              justifyContent="center"
              alignItems="center"
              direction="column"
          >
            <Heading color="midnight">Checkout</Heading>
            {cartItems.length > 0
            ? <React.Fragment>
              {/*User Cart*/}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
                marginTop={2}
                marginBottom={6}
              >
                <Text color="darkGray" italic>{cartItems.length} Items for Checkout</Text>
                <Box padding={2}>
                  {cartItems.map(item => (
                      <Box
                        key={item._id}
                        padding={1}
                      >
                        <Text color="midnight">
                          {item.name} x {item.quantity} - ${item.quantity * item.price}
                        </Text>
                      </Box>
                  ))}
                </Box>
                <Text bold>Total amount: {calculatePrice(cartItems)}</Text>
              </Box>
              {/*Checkout Form*/}
              <form
                  style={{
                    display: 'inlineBlock',
                    textAlign: 'center',
                    maxWidth: '450px'
                  }}
                  onSubmit={this.handleConfirmOrder}
              >
                {/*Address inputs*/}
                <TextField
                    id="address"
                    onChange={this.handleChange}
                    type="text"
                    name="address"
                    placeholder="Shipping Address"
                />
                <TextField
                    id="postalCode"
                    onChange={this.handleChange}
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                />
                <TextField
                    id="city"
                    onChange={this.handleChange}
                    type="text"
                    name="city"
                    placeholder="City of Residence"
                />
                <TextField
                    id="confirmationEmailAddress"
                    onChange={this.handleChange}
                    type="email"
                    name="confirmationEmailAddress"
                    placeholder="Confirmation Email Address"
                />
                {/*Credit Card Element*/}
                <CardElement id="stripe__input" onReady={input => input.focus()}/>
                <button id="stripe__button" type="submit">Submit</button>
              </form>
            </React.Fragment>
            : (
                <Box color="darkWash" shape="rounded" padding={4}>
                  <Heading align="center" color="watermelon" size="xs">Your Cart is Empty</Heading>
                  <Text align="center" italic color="green">Add some brews!</Text>
                </Box>
              )
            }
          </Box>
          {/*Confirmation Modal*/}
          {modal && (
              <ConfirmationModal
                  orderProcessing={orderProcessing}
                  cartItems={cartItems}
                  closeModal={this.closeModal}
                  handleSubmitOrder={this.handleSubmitOrder}
              />
          )}
          <ToastMessage show={toast} message={toastMessage}/>
        </Container>
    );
  }
}

const ConfirmationModal = ({orderProcessing, cartItems, closeModal, handleSubmitOrder}) => (
    <Modal
      accessibilityCloseLabel="close"
      accessibilityModalLabel="Confirm Your Order"
      heading="Confirm Your Order"
      onDismiss={closeModal}
      footer={
        <Box display="flex" marginRight={-1} marginLeft={-1} justifyContent="center">
          <Box padding={1}>
            <Button
              text="Submit"
              size="lg"
              color="red"
              disabled={orderProcessing}
              onClick={handleSubmitOrder}
            />
          </Box>
          <Box padding={1}>
            <Button
                text="Cancel"
                size="lg"
                disabled={orderProcessing}
                onClick={closeModal}
            />
          </Box>
        </Box>
      }
      role="alertdialog"
      size="sm"
    >
      {/*Order Summary*/}
      {!orderProcessing && (
          <Box display="flex" justifyContent="center" alignItems="center" direction="column" padding={2}
             color="lightWash">
            {cartItems.map(item => (
                <Box key={item._id} padding={1}>
                  <Text size="lg" color="red">
                    {item.name} x {item.quantity} - ${item.quantity * item.price}
                  </Text>
                </Box>
            ))}
            <Box padding={2}>
              <Text size="lg" bold>
                Total: {calculatePrice(cartItems)}
              </Text>
            </Box>
          </Box>
      )}

      <Spinner show={orderProcessing} accessibilityLabel="Order Processing Spinner"/>
      {orderProcessing && <Text align="center" italic>Submitting Order...</Text>}
    </Modal>
);

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
    <StripeProvider apiKey="pk_test_NnaRFiEMFyrgCtO4ut6S2WQE00K6lalW29">
      <Elements>
        <CheckoutForm/>
      </Elements>
    </StripeProvider>
);

export default Checkout;