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

  useEffect(() => {
    async function loadOrder() {

        await axios.get(
            `https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/order/demoGetOrderById/${id}`
          ).then((response) => {
              console.log(response.data);
              //add to hooks
              setOrder(response.data);
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

  async function handleOrderSubmit(event) {

    event.preventDefault();

    try {
      // call submit order function
      await axios.put(
        'https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/order/submitOrder',
        {
          outPocket:`${order.outPocket}`,
          inPocket:`${order.inPocket}`,
          amount:`${order.amount}`,
          toCurrency:`${order.toCurrency}`,
          fromCurrency:`${order.fromCurrency}`,
          isFromAmount:`${order.isFromAmount}`,
          userId:`${order.creatorId}`,
          valueDate:`${order.valueDate}`,
          purpose:`${order.purpose}`,
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
      {order && (
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
                <div>Order is not yet submitted.</div>
                <form className="form-inline" onSubmit={handleOrderSubmit}>
                    <button type="submit">Submit Order (Final)</button>
                </form>
              </div>
          )
      }
    </div>
  );
}