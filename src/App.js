import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Select } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';
const photo = require('./nerd.png');

function App() {
  const [coin, setCoin] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [amount, setAmount] = useState(null)
  const [costBasis, setCostBasis] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const isButtonDisabled = coin === '' || !purchaseDate || !amount || isFetching;

  const handleCoinChange = (event) => {
    setCoin(event.target.value);
  };

  const handleAmountChange = (event) => {
    if (event.target.value > 0) {
      setAmount(parseFloat(event.target.value));
    } else setAmount(0);
  }

  function isDate(dateStr) {
    return !isNaN(new Date(dateStr).getDate());
  }

  const applyNewDate = (value) => {
    if (!!value && isDate(value)) {
      const dateString = value && value.toISOString().slice(0,10);
      setPurchaseDate(dateString);
    }
  }

  const handleSubmit = () => {
    const cryptoPriceApi = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${coin}&market=USD&apikey=B51E4JGUNRQKOGTH`;
    setIsFetching(true);
    fetch(cryptoPriceApi).then(response => {
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
      .then(json => {
        const spotPrice = parseInt(json['Time Series (Digital Currency Daily)'][`${purchaseDate}`]['4a. close (USD)'])
        setCostBasis(Math.trunc(spotPrice));
        setIsFetching(false);
      }).catch(e => {
        debugger
        setIsFetching(false);
        throw new Error(`API call for historical ${coin} price data failed: ${e}`);
      })
  }

  return (
    <div className='App'>
      <h1 className='title'>CRYPTO COST BASIS ENGINE</h1>
      <p className='subtitle'>A good way to figure out what that NFT cost you last year.</p>
      <img src={photo} height='175' alt='accountant logo' />
      <header className='App-header'>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          type='date'
          label='Purchase Date*'
          value={purchaseDate}
          maxDate={new Date()}
          format='YYYY-MM-DD'
          onChange={(newValue) => {
            applyNewDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
        <span className='form'>
        <FormControl fullWidth>
          <InputLabel required id='demo-simple-select-label'>Coin</InputLabel>
          <Select
            id='select-crypto'
            value={coin}
            label='Coin'
            onChange={handleCoinChange}
          >
            <MenuItem value={'BTC'}>Bitcoin</MenuItem>
            <MenuItem value={'ADA'}>Cardano</MenuItem>
            <MenuItem value={'ETH'}>Ethereum</MenuItem>
            <MenuItem value={'MATIC'}>Polygon</MenuItem>
            <MenuItem value={'SOL'}>Solana</MenuItem>
            <MenuItem value={'LUNA'}>Terra</MenuItem>
            </Select>
        </FormControl>
        </span>
        <span className='amount'>
          <TextField 
            type='number' 
            label={'Amount'}
            onChange={handleAmountChange}
            required />
        </span>
      </header>
      {isButtonDisabled &&
          <Button
            disabled
            size='large' 
            variant='contained' 
            onClick={null}>
              Get Cost Basis
          </Button>
        }
        {!isButtonDisabled &&
          <Button
            size='large' 
            variant='contained'
            onClick={handleSubmit}>
              Get Cost Basis
          </Button>
        }
      <div className='result'>
        {`Estimated Cost Basis: `}
        {isFetching &&
          <span className="loading">
            <CircularProgress color="success" size={20}/>
          </span>
        }
        {!isFetching && 
          <span className='dollars'>
            {`~$${parseInt(costBasis*amount)} USD`}
          </span>
        }
      </div>
      <div className='disclaimer'>DISCLAIMER: This website does not provide any tax, legal or accounting advice. This material has been prepared for informational purposes only, and is not intended to provide, and should not be relied on for, tax, legal or accounting advice. You should consult your own tax, legal and accounting advisors before engaging in any transaction. Data source: <a href='https://www.alphavantage.co/
'>alphavantage.co</a> (a free api for historical crypto prices). Estimates are given based on the closing price of the asset on the given day. The app is rounding values throughout the calculation to produce integers as output.</div>
      <div className='footer'><b>2022, All Rights Reserved.</b></div>
    </div>
  );
}

export default App;
