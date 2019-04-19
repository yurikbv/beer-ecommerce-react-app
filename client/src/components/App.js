import React, { Component } from 'react';
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon } from "gestalt";
import Strapi from 'strapi-sdk-javascript/build/main';
import {Link} from "react-router-dom";
import './App.css';
import Loader from "./Loader";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {

  state = {
    brands: [],
    searchTerm: '',
    loadingBrands: true
  };

  async componentDidMount() {
    try {
      const response  = await strapi.request('POST','graphql', {
        data: {
          query: `
          query{
            brands{
              _id
              name
              description
              image{
                url
              }
            }
          }`
        }
      });
      this.setState({brands: response.data.brands, loadingBrands: false});
    } catch (error) {
      console.error(error);
      this.setState({loadingBrands: false});
    }
  }

  handleChange = ({value}) => {
    this.setState({searchTerm: value})
  };

  filteredBrands = (brands, searchTerm) => {
    return brands.filter(brand => {
      return (brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase()));
    })
  };

  render() {

    const {brands, searchTerm, loadingBrands} = this.state;

    return (
      <Container>

        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
              accessibilityLabel="Brands Search Field"
              id="searchField"
              onChange={this.handleChange}
              placeholder="Search Brand"
              value={searchTerm}
          />
          <Box margin={3}>
            <Icon
                icon="filter"
                accessibilityLabel="filter"
                size={20}
                color={searchTerm ? "orange" : "gray"}
            />
          </Box>
        </Box>

        <Box
            display="flex"
            justifyContent="center"
            marginBottom={2}
        >
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>
        <Box
            display="flex"
            justifyContent="around"
            wrap
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: '#d6c8ec'
              }
            }}
            shape="rounded"
        >
          {this.filteredBrands(brands,searchTerm).map(brand => (
              <Box
                  key={brand._id}
                  width={200}
                  margin={2}
                  paddingY={4}
              >
                <Card
                    image={
                      <Box height={200} width={200}>
                        <Image fit="cover"
                               naturalHeight={1}
                               src={`${apiUrl}${brand.image.url}`}
                               naturalWidth={1}
                               alt="Brand"/>
                      </Box>
                    }>
                  <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                    <Text bold size="xl">{brand.name}</Text>
                    <Text>{brand.description}</Text>
                    <Text bold size="xl">
                      <Link to={`/${brand._id}`}>See Brews</Link>
                    </Text>
                  </Box>
                </Card>
              </Box>
          ))}
        </Box>
        {/*<Spinner show={loadingBrands} accessibilityLabel="Loading Spinner"/>*/}
        <Loader show={loadingBrands}/>
      </Container>
    );
  }
}

export default App;
