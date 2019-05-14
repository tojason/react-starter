import React, { Component } from 'react';
import {
  Header,
  Grid,
  Image,
  Segment,
  Label,
} from 'semantic-ui-react';
import socketClient from 'socket.io-client';

import styles from './Home.scss';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img64: null,
      distance: -1,
      brake: false,
      time: new Date().getTime() + 500,
      nextUpdate: null,
      remain: 1,
    };
    this.endpoint = 'http://0.0.0.0:8081';
  }

  componentWillMount() {
    this.socket = socketClient(this.endpoint);
    this.socket.on('img', (data) => {
      this.setState({
        img64: data,
        nextUpdate: new Date().getTime() + 5000,
        remain: 1,
      });
    });
    this.socket.on('distance-update', (data) => {
      this.setState({
        distance: data,
      });
    });
    this.socket.on('brake', (data) => {
      this.setState({
        brake: data,
        time: new Date().getTime() + 500,
      });
    });

    this.interval = setInterval(() => {
      const { time, brake } = this.state;
      if (brake === true) {
        if (time > new Date().getTime()) {
          this.setState({
            brake: false,
          });
        }
      }
    }, 1000);
    this.check = setInterval(() => {
      const { nextUpdate } = this.state;
      const current = new Date().getTime();
      if (current <= nextUpdate) {
        this.setState({
          remain: this.state.remain - 1
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.check);
  }

  render() {
    const { img64, distance, brake, remain } = this.state;
    let cameraView = (
      <Image
        className='camera-view'
        src='/assets/sample.png'
        alt='Sample'
      />
    );
    if (img64 !== null) {
      cameraView = <img className='camera-view' src={`data:image/png;base64, ${img64}`}/>
    }

    let isBrake = (
      <Label className='brake-info' color='red'>On Brake</Label>
    );
    if (brake == false) {
      isBrake = <Label className='brake-info' color='green'>No Brake</Label>;
    }

    return (
      <div className='Home' style={{textAlign: 'center'}}>
        <Header as='h1'>Dashboard</Header>
        <Grid>
          <Grid.Column width={12} className='col-left'>
            <Segment raised>
              <Header className='title' as='h1' dividing>
                ADAS Camera View
              </Header>
              {img64 !== null &&
                <img className='camera-view' src={`data:image/png;base64, ${img64}`}/>
              }
              <Segment className='remain'>
                {`Next Image Update in ${this.state.remain}s.`}
              </Segment>
            </Segment>
          </Grid.Column>
          <Grid.Column width={4} className='col-right'>
            <Segment
              raised
              color='red'
              className='car-info'
              >
              {`Distance: ${distance}`}
            </Segment>
            <Segment
              raised
              color='orange'
              className='car-info'
              >
              { isBrake }
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Home;
