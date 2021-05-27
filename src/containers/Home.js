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

  displayOrder(order) {
    return (
      <div className='order'>
        <h3>/hi</h3>
        <p>{order.day}</p>
      </div>
    )
  }

  async handleOrderSubmit(event) {
    event.preventDefault();
    const { userId } = this.state;
    console.log("This is the user " + {userId})
    await axios.get(
      `https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/order/demoGetOrder/${userId}`
    ).then((response) => {
        console.log(response.data[0]);
        this.setState({submitSuccess:"true"});
        this.setState({message:"order complete"});
        response.data.map((item, index) => {
          console.log(response.data[index].orderId);

          return (
            <h1>hi</h1>
          )
        })
        this.setState({success:"true"});
        this.setState({data:response.data});
        console.log(this.state.success);

    }).catch((err)=>{
        this.setState({message:"missing fields"});
    });
  }

  render() {
    return (
    <div className="Home">
      <h1>View your Orders</h1>
        <label>Enter UserId:</label>
            <input
              type="text"
              name="userId"
              onChange={this.handleChange}
              value={this.state.userId}
            />


      <form className="view-order-form" onSubmit={this.handleOrderSubmit}>
        <button type="submit">View Orders</button>
        </form>

      {

        (this.state.success == 'true' &&
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