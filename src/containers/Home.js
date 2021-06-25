import React, { useState, useEffect, Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import axios from 'axios';
import './Home.css';
import { useHistory, Link } from "react-router-dom";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      success: false,
      message: '',
      data: [],
    };

    this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
  }

  async handleOrderSubmit(event) {
    event.preventDefault();
    const { busId } = this.state;
    console.log("This is the user " + {busId})
    await axios.get(
      `https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/dashboard/${busId}`
    ).then((response) => {
        console.log(response.data[0]);
        this.setState({success:true});
        this.setState({message:"order complete"});

        this.setState({data:response.data});
        console.log(this.state.success);

    }).catch((err)=>{
        this.setState({message:"missing fields"});
    });
  }

  render() {
    return (
    <div className="Home">
      <h1>Dashboard</h1>
        <label>Enter BusinessId:</label>
            <input
              type="text"
              name="userId"
              onChange={this.handleChange}
              value={this.state.busId}
            />


      <form className="view-order-form" onSubmit={this.handleOrderSubmit}>
        <button type="submit">Dashboard</button>
        </form>

      {

        (this.state.success == true &&
        this.state.data.map((item,i) =>

        <li key={i}>Test</li>)) &&

        <h2>Showing {this.state.data.length} orders:</h2> &&

        this.state.data.map(function(item, i){
          console.log('test');
          console.log(`${item.purpose}`);

          return (

            <LinkContainer key={item.orderId} to={`/order/${item.orderId}`}>
            <div className='order'>
            <h3>Id: {item.orderId}</h3>
            <p>inPocket: {item.outPocket} outPocket: {item.inPocket}</p>
            <p>Amount: {item.amount} {item.fromCurrency}</p>
            <h4>{item.currentStatus}</h4>
            </div>
            </LinkContainer>
        )})

        }

    </div>
  );
}
}