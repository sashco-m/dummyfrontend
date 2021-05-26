import React, { Component } from 'react';
import axios from 'axios';
import './Form.css';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outPocket: '',
      inPocket: '',
      amount: '',
      toCurrency: 'USD',
      fromCurrency: 'CAD',
      userId: '',
      valueDate: 'Closest Business Day',
      purpose: 'ex. purpose 1',
      success:'false',
      orderId:'',
      message:'',
      convertedAmount:'',
      rate:'',
      submitSuccess:'false',
    };
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this);
    this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
  }

  async handlePlaceOrder(event) {
    event.preventDefault();
    const { outPocket, inPocket, amount, toCurrency, fromCurrency, userId, valueDate, purpose, success } = this.state;
    await axios.post(
      'https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/order/placeOrder',
      {
        outPocket:`${outPocket}`,
        inPocket:`${inPocket}`,
        amount:`${amount}`,
        toCurrency:`${toCurrency}`,
        fromCurrency:`${fromCurrency}`,
        isFromAmount:"false",
        userId:`${userId}`,
        valueDate:`${valueDate}`,
        purpose:`${purpose}`
    }
    ).then( async (response) => {
        console.log(response);
        console.log(response.data.orderId);
        this.setState({orderId:`${response.data.orderId}`});
        this.setState({message:"Order Id" + response.data.orderId + " placed successfully."});
        this.setState({success:"true"});
        //add quote
        await this.getQuote();

    }).catch((err)=>{
        this.setState({message:"missing fields"});
    });
  }

  async handleRefresh(event){
    event.preventDefault();
    await this.getQuote();
  }

  async getQuote(){
    const {amount, toCurrency, fromCurrency} = this.state;
    await axios.post(
        'https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/quote',
        {
          amount:`${amount}`,
          toCurrency:`${toCurrency}`,
          fromCurrency:`${fromCurrency}`,
          isFromAmount:"false",
      }
      ).then((response) => {
          console.log(response);
          this.setState({convertedAmount:`${response.data[0]}`});
          this.setState({rate:`${response.data[2]}`});
      }).catch((err)=>{
          this.setState({message:"quote failed"});
      });
  }

  async handleOrderSubmit(event) {
    event.preventDefault();
    const { outPocket, inPocket, amount, toCurrency, fromCurrency, userId, valueDate, purpose, success, orderId } = this.state;
    await axios.put(
      'https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/order/submitOrder',
      {
        outPocket:`${outPocket}`,
        inPocket:`${inPocket}`,
        amount:`${amount}`,
        toCurrency:`${toCurrency}`,
        fromCurrency:`${fromCurrency}`,
        isFromAmount:"false",
        userId:`${userId}`,
        valueDate:`${valueDate}`,
        purpose:`${purpose}`,
        orderId:`${orderId}`
    }
    ).then((response) => {
        console.log(response);
        this.setState({submitSuccess:"true"});
        this.setState({message:"order complete"});
    }).catch((err)=>{
        this.setState({message:"missing fields"});
    });
  }

  render() {
    return (
        <div className="outer">
      <div className="box">
        <form className="form-inline" onSubmit={this.handlePlaceOrder}>

          <label>Out Pocket:</label>
          <input
            type="text"
            name="outPocket"
            onChange={this.handleChange}
            value={this.state.outPocket}
          />

          <label>in Pocket:</label>
          <input
            type="text"
            name="inPocket"
            onChange={this.handleChange}
            value={this.state.inPocket}
          />

          <label>userId:</label>
          <input
            type="text"
            name="userId"
            onChange={this.handleChange}
            value={this.state.userId}
          />

          <label>Amount:</label>
          <input
            type="text"
            name="amount"
            onChange={this.handleChange}
            value={this.state.amount}
          />

          <label>Trade Currency:</label>
          <select name="toCurrency" value={this.state.toCurrency} onChange={this.handleChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="AUD">AUD</option>
          </select>

          <label>Settlement Currency:</label>
          <select name="fromCurrency" value={this.state.fromCurrency} onChange={this.handleChange}>
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="AUD">AUD</option>
          </select>

          <label>Debit Date:</label>
          <select name="valueDate" value={this.state.valueDate} onChange={this.handleChange}>
            <option value="Closest Business Day">Closest Business Day</option>
            <option value="Closest Business Day + 1">Closest Business Day + 1</option>
            <option value="Closest Business Day + 2">Closest Business Day + 2</option>
          </select>

          <label>Purpose:</label>
          <select name="purpose" value={this.state.purpose} onChange={this.handleChange}>
            <option value="ex. purpose 1">ex. purpose 1</option>
            <option value="ex. purpose 2">ex. purpose 2</option>
            <option value="ex. purpose 3">ex. purpose 3</option>
          </select>

          <button type="submit">Place Order</button>
        </form>

        {
            this.state.message.length > 0 &&
            <h2>
                {this.state.message}
            </h2>
        }
    </div>
        {

            (this.state.success == 'true' && this.state.submitSuccess == 'false') &&
            <div className="box">
               <span><button onClick={this.handleRefresh}>Refresh Quote</button></span>
               <span><h2>Quote</h2>{ this.state.convertedAmount}</span>
               <span><h2>Rate</h2>{ this.state.rate}</span>
            <form className="form-inline" onSubmit={this.handleOrderSubmit}>
                <button type="submit">Submit Order (Final)</button>
            </form>
            </div>
        }

      </div>
    );
  }
}