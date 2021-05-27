import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import axios from 'axios';
import './Order.css';

export default function Order() {
    const { id } = useParams();
    const [order, setOrder] = useState({});
    const [transaction, setTransaction] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [convertedAmount, setConvertedAmount] = useState('');
    const [rate, setRate] = useState('');

    //updating if status is pending review
    const [newToCurrency, setNewToCurrency] = useState('');
    const [newFromCurrency, setNewFromCurrency] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newOutPocket, setNewOutPocket] = useState('');
    const [newInPocket, setNewInPocket] = useState('');
    const [newValueDate, setNewValueDate] = useState('');
    const [newPurpose, setNewPurpose] = useState('');

  useEffect(() => {
    async function loadOrder() {

        await axios.get(
            `https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/order/demoGetOrderById/${id}`
          ).then((response) => {
              console.log(response.data);
              //add to hooks
              setOrder(response.data);
              setNewToCurrency(response.data.toCurrency);
              setNewFromCurrency(response.data.fromCurrency);
              setNewAmount(response.data.amount);
              setNewOutPocket(response.data.outPocket);
              setNewInPocket(response.data.inPocket);
              setNewValueDate(response.data.valueDate);
              setNewPurpose(response.data.purpose);
              return response.data;
          }).catch((err)=>{
              console.log(err);
              return "oops";
          });
    }

    async function onLoad() {
      try {
        const test = await loadOrder();
        //add note to hooks
        console.log(test);
        console.log(order);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  async function handleRefresh(event){
    event.preventDefault();
    await getQuote();
  }

  async function getQuote(){

    await axios.post(
        'https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/quote',
        {
          amount:`${newAmount}`,
          toCurrency:`${newToCurrency}`,
          fromCurrency:`${newFromCurrency}`,
          isFromAmount:`${order.isFromAmount}`,
      }
      ).then((response) => {
          console.log(response);
          setConvertedAmount(`${response.data[0]}`);
          setRate(`${response.data[2]}`);
      }).catch((err)=>{
          console.log(err);
      });
  }

  async function handleOrderSubmit(event) {

    event.preventDefault();

    try {
      // call submit order function
      await axios.put(
        'https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/order/submitOrder',
        {
          outPocket:`${newOutPocket}`,
          inPocket:`${newInPocket}`,
          amount:`${newAmount}`,
          toCurrency:`${newToCurrency}`,
          fromCurrency:`${newFromCurrency}`,
          isFromAmount:`${order.isFromAmount}`,
          userId:`${order.creatorId}`,
          valueDate:`${newValueDate}`,
          purpose:`${newPurpose}`,
          orderId:`${order.orderId}`
      }
      ).then((response) => {
          console.log(response);
          const newOrder = order;
          newOrder.currentStatus = "Pending Txn Create";
          setOrder(newOrder);
          setSubmitted(true);

      }).catch((err)=>{
          console.log(err);
      });
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div className="Notes">

      {(order && order.currentStatus != "Pending Review") && (
          //show order/txn info and submit button
        <div className="box">
            <div className="form-inline">
                <h3>Amount</h3>
                <div>{order.amount}</div>
                <h3>Status</h3>
                <div>{order.currentStatus}</div>
                <h3>Date Placed</h3>
                <div>{order.datePlaced}</div>
                <h3>Settlement Currency</h3>
                <div>{order.fromCurrency}</div>
                <h3>Trade Currency</h3>
                <div>{order.toCurrency}</div>
            </div>
        </div>
      )}
      {
          (order.currentStatus == "Pending Review" && !submitted) && (
              <div className="box">
                  <form className="form-inline" onSubmit={handleOrderSubmit}>
                    <label>Out Pocket:</label>
                    <input
                    type="text"
                    name="outPocket"
                    onChange={e => setNewOutPocket(e.target.value)}
                    value={newOutPocket}
                    />

                    <label>in Pocket:</label>
                    <input
                    type="text"
                    name="inPocket"
                    onChange={e => setNewInPocket(e.target.value)}
                    value={newInPocket}
                    />

                    <label>Amount:</label>
                    <input
                    type="text"
                    name="amount"
                    onChange={e => setNewAmount(e.target.value)}
                    value={newAmount}
                    />

                    <label>Trade Currency:</label>
                    <select name="toCurrency" value={newToCurrency} onChange={e => setNewToCurrency(e.target.value)}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="AUD">AUD</option>
                    </select>

                    <label>Settlement Currency:</label>
                    <select name="fromCurrency" value={newFromCurrency} onChange={e => setNewFromCurrency(e.target.value)}>
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="AUD">AUD</option>
                    </select>

                    <label>Debit Date:</label>
                    <select name="valueDate" value={newValueDate} onChange={e => setNewValueDate(e.target.value)}>
                    <option value="Closest Business Day">Closest Business Day</option>
                    <option value="Closest Business Day + 1">Closest Business Day + 1</option>
                    <option value="Closest Business Day + 2">Closest Business Day + 2</option>
                    </select>

                    <label>Purpose:</label>
                    <select name="purpose" value={newPurpose} onChange={e => setNewPurpose(e.target.value)}>
                    <option value="ex. purpose 1">ex. purpose 1</option>
                    <option value="ex. purpose 2">ex. purpose 2</option>
                    <option value="ex. purpose 3">ex. purpose 3</option>
                    </select>

                    <button type="submit">Submit Order (Final)</button>
                    </form>


                <div>Order is not yet submitted.</div>
                <span><button onClick={handleRefresh}>Refresh Quote</button></span>
                <span><h2>Quote</h2>{convertedAmount}</span>
                <span><h2>Rate</h2>{rate}</span>


                <span><button type="submit">Submit Order (Final)</button></span>
              </div>
          )
      }
    </div>
  );
}