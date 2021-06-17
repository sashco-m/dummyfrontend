import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import axios from 'axios';
import './Quote.css';

export default function Quote() {
    const [amount, setAmount] = useState('0.00');
    const [fee, setFee] = useState('0.00');
    const [convertedAmount, setConvertedAmount] = useState('0.00');
    const [rate, setRate] = useState('0.00');
    const [isAmountHaveCurrency, setIsAmountHaveCurrency] = useState(true);
    const [haveCurrency, setHaveCurrency] = useState('CAD');
    const [wantCurrency, setWantCurrency] = useState('CAD');
    const [amountWeConvert, setAmountWeConvert] = useState('0.00');


    //savings
    const [feesSaved, setFeesSaved] = useState('');
    const [marginSaved, setMarginSaved] = useState('');

    const [error, setError] = useState('');


  async function handleSubmit(event){
    event.preventDefault();
    await getQuote();
  }

  async function getQuote(){

    await axios.post(
        'https://qnob3fk5jk.execute-api.ca-central-1.amazonaws.com/dev/quote',
        {
          amount:`${amount}`,
          wantCurrency:`${wantCurrency}`,
          haveCurrency:`${haveCurrency}`,
          isAmountHaveCurrency:`${isAmountHaveCurrency}`,
      }
      ).then((response) => {
          console.log(response);
          setError('');
          //fill all the state hooks
          setFee(response.data.fee);
          setConvertedAmount(response.data.converted);
          setRate(response.data.rate);
          setAmountWeConvert(response.data.weConvert);
      }).catch((err)=>{
          console.log(err);
          setError('invalid quote (missing fields/fee is greater than converted amount)');
      });
  }

  return (
              <div className="box">
                  <form className="form-inline" onSubmit={handleSubmit}>

                <div className="space">
                  <label>You Send vs. Recipient Receives
                    <input
                    type="checkbox"
                    name="isAmountHaveCurrency"
                    onChange={e => setIsAmountHaveCurrency(!isAmountHaveCurrency)}
                    checked={isAmountHaveCurrency}
                    />
                    </label>
                </div>
                <div className="space">
                    {
                        isAmountHaveCurrency
                        ? <label>Sent
                        <input
                        type="text"
                        name="Sent"
                        onChange={e => setAmount(e.target.value)}
                        value={amount}
                        disabled={false}
                        />
                        </label>
                        :<label>Sent
                        <input
                        type="text"
                        name="Sent"
                        onChange={e => setConvertedAmount(e.target.value)}
                        value={convertedAmount}
                        disabled={true}
                        />
                        </label>
                    }

                    <select name="haveCurrency" value={haveCurrency} onChange={e => setHaveCurrency(e.target.value)}>
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="AUD">AUD</option>
                    </select>
                </div>

                    {
                        fee && <div className="space">Total Fees {fee} {haveCurrency}</div>
                    }
                    {
                        amountWeConvert && <div className="space">Amount We'll convert {amountWeConvert}</div>
                    }
                    {
                        rate && <div className="space"> Estimated Rate {rate}</div>
                    }
                <div className="space">
                    {
                        isAmountHaveCurrency
                        ? <label>Received
                        <input
                        type="text"
                        name="Received"
                        onChange={e => setConvertedAmount(e.target.value)}
                        value={convertedAmount}
                        disabled={true}
                        />
                        </label>
                        :<label>Received
                        <input
                        type="text"
                        name="Received"
                        onChange={e => setAmount(e.target.value)}
                        value={amount}
                        disabled={false}
                        />
                        </label>
                    }

                    <select name="wantCurrency" value={wantCurrency} onChange={e => setWantCurrency(e.target.value)}>
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="AUD">AUD</option>
                    </select>
                </div>

                    <button type="submit">Get Quote</button>
                    </form>
                    {
                     error && <h3>{error}</h3>
                    }
                 </div>
  );
}