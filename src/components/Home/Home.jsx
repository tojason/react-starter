import React, { Component } from 'react';
import {
  Header,
  Grid,
  Image,
  Segment,
  Label,
} from 'semantic-ui-react';

import styles from './Home.scss';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='Home' style={{textAlign: 'center'}}>
        <Header as='h1'>Custom React Starter</Header>
      </div>
    );
  }
}

export default Home;
