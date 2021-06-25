import React, { Component } from 'react';
import axios from 'axios';
import './Form.css';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inBus:'9105181016286943',
      outBus:'9105181081967583',
      outPocket: '10162869432257133328',
      inPocket: '10162869432150075627',
      haveCurrency:'CAD',
      wantCurrency:'USD',
      amount: '',
      userId: '9105180098392512',
      orderType: 'send',
      isAmountHaveCurrency:true,
      purpose:'ex purpose 1',
      valueDate:'asap',
      success:'false',
      orderId:'',
      orderNote:'Please leave a note.',

      message:'',
      convertedAmount:'',
      weConvert:'',
      fee:'',
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
    const { outPocket, inPocket, amount, userId, valueDate, purpose, success, inBus, outBus, haveCurrency, wantCurrency, orderType, orderNote,isAmountHaveCurrency } = this.state;
    await axios.post(
      'https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/order/placeOrder',
      {
          outPocket:`${outPocket}`,
          inPocket:`${inPocket}`,
          outBusinessId:`${outBus}`,
          inBusinessId:`${inBus}`,
          haveCurrency:`${haveCurrency}`,
          wantCurrency:`${wantCurrency}`,
          orderType:`${orderType}`,
          userId: `${userId}`,
          amount: amount,
          isAmountHaveCurrency:`${isAmountHaveCurrency}`,
          valueDate:`${valueDate}`,
          purpose:`${purpose}`,
          orderNote:`${orderNote}`
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
    const {amount, wantCurrency, haveCurrency, isAmountHaveCurrency, toPocket} = this.state;
    await axios.post(
        'https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/quote',
        {
          amount:`${amount}`,
          wantCurrency:`${wantCurrency}`,
          haveCurrency:`${haveCurrency}`,
          isAmountHaveCurrency:`${isAmountHaveCurrency}`,
          toPocket: `${toPocket}`
      }
      ).then((response) => {
          console.log(response);
          //fill all the state hooks
          this.setState({fee: response.data.fee});
          this.setState({convertedAmount: response.data.converted});
          this.setState({rate: response.data.rate});
          this.setState({weConvert: response.data.weConvert});
      }).catch((err)=>{
          console.log(err);
          this.setState({message:"quote failed"});
      });
  }

  async handleOrderSubmit(event) {
    event.preventDefault();
    const { outPocket, inPocket, amount, toCurrency, fromCurrency, userId, valueDate, purpose, success, orderId } = this.state;
    await axios.put(
      'https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/order/submitOrder',
      {
        userId: userId,
        orderId: orderId
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
        <label>userId:</label>
          <input
            type="text"
            name="userId"
            onChange={this.handleChange}
            value={this.state.userId}
          />
          <label>BusinessId:</label>
          <input
            type="text"
            name="outBus"
            onChange={this.handleChange}
            value={this.state.outBus}
          />
            <h3>I want to pay</h3>
          <select name="inBus" value={this.state.inBus} onChange={this.handleChange}>
            <option value="123">Supplier 1</option>
            <option value="321">Supplier 2</option>
            <option value="999">Supplier 3</option>
          </select>
          <select name="wantCurrency" value={this.state.wantCurrency} onChange={this.handleChange}>
            <option value="CAD">CAD pocket</option>
            <option value="USD">USD pocket</option>
            <option value="EUR">EUR pocket</option>
          </select>

          <h3>Amount</h3>
          <input
            type="number"
            name="amount"
            onChange={this.handleChange}
            value={this.state.amount}
          />

          <h3>From Pocket</h3>
          <select name="haveCurrency" value={this.state.haveCurrency} onChange={this.handleChange}>
            <option value="CAD">CAD Pocket</option>
            <option value="EUR">EUR Pocket</option>
            <option value="USD">USD Pocket</option>
            <option value="AUD">AUD Pocket</option>
          </select>

          <label>Purpose:</label>
          <select name="purpose" value={this.state.purpose} onChange={this.handleChange}>
            <option value="ex. purpose 1">ex. purpose 1</option>
            <option value="ex. purpose 2">ex. purpose 2</option>
            <option value="ex. purpose 3">ex. purpose 3</option>
          </select>

          <label>order Note:</label>
          <input
            type="text"
            name="orderNote"
            onChange={this.handleChange}
            value={this.state.orderNote}
          />

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
               <p><button onClick={this.handleRefresh}>Refresh Quote</button></p>
               <p>Amount: {this.state.amount} {this.state.haveCurrency}</p>
               <p>Minus fee: {this.state.fee} {this.state.haveCurrency}</p>
               <p>We convert: {this.state.weConvert} {this.state.haveCurrency}</p>
               <p>With Rate: {this.state.rate}</p>
                <p>final amount: {this.state.convertedAmount} {this.state.wantCurrency}</p>
            <form className="form-inline" onSubmit={this.handleOrderSubmit}>
                <button type="submit">Submit Order (Final)</button>
            </form>
            </div>
        }

      </div>
    );
  }
}