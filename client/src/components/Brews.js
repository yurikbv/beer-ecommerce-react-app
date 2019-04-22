import React, {Component} from 'react';
import Strapi from 'strapi-sdk-javascript/build/main';
import {Box, Heading, Text, Image, Card, Button, Mask, IconButton} from "gestalt";
import {Link} from "react-router-dom";
import {calculatePrice, setCart, getCart} from "../utils";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Brews extends Component {

  state = {
    brews: [],
    brand: '',
    cartItems: []
  };

  async componentDidMount() {
    try {
      const response = await strapi.request('POST','/graphql', {
        data: {
          query:
              `query{
            brand(id: "${this.props.match.params.brandId}"){
                _id
                name
                brews{
                  _id
                  name
                  description
                  image{
                    url
                  }
                  price
                }
              }
            }`
        }
      });
      this.setState({
        brews: response.data.brand.brews,
        brand: response.data.brand.name,
        cartItems: getCart()
      })
    } catch (e) {
      console.error(e);
    }
  }

  addToCart = (brew) => {
    const alreadyInCart = this.state.cartItems.findIndex(item => item._id === brew._id);

    if(alreadyInCart === -1){
      const updateItems = [...this.state.cartItems, {
        ...brew,
        quantity: 1
      }];
      this.setState({cartItems: updateItems},() => {
        setCart(updateItems)
      });
    } else {
      const updateItems = [...this.state.cartItems];
      updateItems[alreadyInCart].quantity += 1;
      this.setState({cartItems: updateItems},() => {
        setCart(updateItems)
      });
    }
  };

  deleteItemFromCart = (itemToDeleteId) => {
    const filteredItems = this.state.cartItems.filter(item => item._id !== itemToDeleteId);
    this.setState({cartItems: filteredItems}, () => setCart(filteredItems))
  };


  render() {

    const {brand, brews, cartItems} = this.state;

    return (
        <Box
          marginTop={4}
          display="flex"
          justifyContent="center"
          alignItems="start"
          dangerouslySetInlineStyle={{
            __style: {
              flexWrap: "wrap-reverse"
            }
          }}
        >
          {/*Brews Section*/}
          <Box
            display="flex"
            direction="column"
            alignItems="center"
          >
            {/*Brews Heading*/}
            <Box margin={2}>
              <Heading color="orchid">{brand}</Heading>
            </Box>
            {/*Brews*/}
            <Box
              dangerouslySetInlineStyle={{
                __style: {
                  backgroundColor: '#bdcdd9'
                }
              }}
              wrap
              shape="rounded"
              display="flex"
              justifyContent="center"
              padding={4}

            >
              {brews.map( brew => (
                  <Box
                      key={brew._id}
                      width={200}
                      margin={2}
                      paddingY={4}
                  >
                    <Card
                        image={
                          <Box height={250} width={210}>
                            <Image fit="cover"
                                   naturalHeight={1}
                                   src={`${apiUrl}${brew.image.url}`}
                                   naturalWidth={1}
                                   alt="Brand"/>
                          </Box>
                        }>
                      <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                        <Box marginBottom={2}>
                          <Text bold size="xl">{brew.name}</Text>
                        </Box>
                        <Text>{brew.description}</Text>
                        <Text color="orchid">${brew.price}</Text>
                        <Box marginTop={2}>
                          <Text bold size="xl">
                            <Button
                                onClick={() => this.addToCart(brew)}
                                text="Add to Cart"
                                color="blue"/>
                          </Text>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
              ))}
            </Box>
          </Box>
          {/*User Cart*/}
          <Box
            marginTop={2}
            marginLeft={8}
            alignSelf="end"
          >
            <Mask
              shape="rounded"
              wash
            >
              <Box display="flex" direction="column" alignItems="center" padding={2}>
                {/*User Cart Heading*/}
                <Heading align="center" size="sm">Your Cart</Heading>
                <Text color="gray" italic>
                  {cartItems.length} items selected
                </Text>
                {/*Cart Items*/}

                {cartItems.map(item => (
                    <Box key={item._id} display="flex" alignItems="center">
                      <Text>{item.name} x {item.quantity} - ${(item.quantity * item.price).toFixed(2)}</Text>
                      <IconButton
                          accessibilityLabel="Delete Item"
                          icon="cancel"
                          size="sm"
                          iconColor="red"
                          onClick={() => this.deleteItemFromCart(item._id)}
                      />
                    </Box>
                ))}

                <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                  <Box margin={2}>
                    {cartItems.length === 0 && (
                        <Text color="red">Please select some items</Text>
                    )}
                  </Box>
                  <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                  <Text>
                    <Link to="/checkout">Checkout</Link>
                  </Text>
                </Box>
              </Box>
            </Mask>
          </Box>
        </Box>

    );
  }
}

export default Brews;