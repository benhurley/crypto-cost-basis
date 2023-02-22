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

interface Event {
  target: {
    value: string,
  }
};

function App() {
  const [coin, setCoin] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0)
  const [costBasis, setCostBasis] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isThrottled, setIsThrottled] = useState<boolean>(false);

  const isButtonDisabled = coin === '' || !purchaseDate || !amount || isFetching || isThrottled;

  const handleCoinChange = (event: Event) => {
    setCoin(event.target.value);
  };

  const round = (num: number): number => {
    return Math.round(num * 100) / 100;
  }

  const handleAmountChange = (event: Event) => {
    if (!!event.target.value) {
      setAmount(parseFloat(event.target.value));
    } else setAmount(0);
  }

  const isDate = (dateStr: string) => {
    return !isNaN(new Date(dateStr).getDate());
  }

  const applyNewDate = (value: any) => {
    if (!!value && isDate(value)) {
      const dateString = value.toISOString().slice(0, 10);
      setPurchaseDate(dateString);
    }
  }

  const handleThrottle = () => {
    setIsThrottled(true);
    setTimeout(() => {
      setIsThrottled(false);
      setCostBasis(0);
    }, 60000);
  }

  const handleSubmit = () => {
    const cryptoPriceApi = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${coin}&market=CNY&apikey=B51E4JGUNRQKOGTH`;
    setIsFetching(true);
    fetch(cryptoPriceApi).then(response => {
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
      .then(json => {
        if (!!json['Note']) {
          handleThrottle();
        }
        const spotPrice = parseFloat(json['Time Series (Digital Currency Daily)'][`${purchaseDate}`]['4b. close (USD)'])
        setCostBasis(round(spotPrice * amount));
        setIsFetching(false);
      }).catch(e => {
        setIsFetching(false);
        throw new Error(`API call for historical ${coin} price data failed: ${e}`);
      })
  }

  return (
    <div className='App'>
      <h1 className='title'>CRYPTO COST BASIS ENGINE</h1>
      <p className='subtitle'>A good way to guess what that NFT cost you last year.</p>
      <img src={photo} height='175' alt='accountant logo' />
      <header className='App-header'>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label='Purchase Date*'
            value={purchaseDate}
            maxDate={new Date()}
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
              <MenuItem value={'ETH'}>Ethereum</MenuItem>
              <MenuItem value={'SOL'}>Solana</MenuItem>
              <MenuItem value={'DOGE'}>Dogecoin</MenuItem>
              <MenuItem value={'SHIB'}>Shiba-Inu</MenuItem>
              <MenuItem value={'MATIC'}>Polygon</MenuItem>
              <MenuItem value={'ADA'}>Cardano</MenuItem>
              <MenuItem value={'XRP'}>Ripple</MenuItem>
              <MenuItem value={'LTC'}>Litecoin</MenuItem>
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
      <Button
        disabled={isButtonDisabled}
        size='large'
        variant='contained'
        onClick={handleSubmit}>
        Get Estimate
      </Button>
      <div className='result'>
        {`Estimation: `}
        {isFetching &&
          <span className="loading">
            <CircularProgress color="success" size={20} />
          </span>
        }
        {!isFetching && !isThrottled &&
          <span className='dollars'>
            {`$${costBasis} USD`}
          </span>
        }
        {isThrottled &&
          <span className="throttled">Throttled: Max 5 requests per minute.</span>
        }
      </div>
      <div className='disclaimer'>
        Disclaimer: The information provided on this website is for educational purposes only and should not be construed as financial or investment advice. We provide cost basis estimations based on historical price data in cryptocurrencies, which is subject to market volatility and may not be accurate at the time of your transaction. You should always conduct your own research and seek professional advice before making any financial decisions. We do not guarantee the accuracy or completeness of the information on this site and are not liable for any errors or omissions, or for any losses or damages resulting from the use of this information. By using this site, you acknowledge and agree that you are solely responsible for any investment decisions you make based on the information provided.
      </div>
      <div className='disclaimer'>
        Data source: <a target="_blank" rel="noopener noreferrer" href='https://www.alphavantage.co/'>alphavantage.co</a>, a free api for historical crypto prices. Estimates are given based on the closing price of the asset on the given day.
      </div>
      <div className='footer'><b>Created with ♥ by <a target="_blank" rel="noopener noreferrer" href="https://justben.fyi">Ben</a>. 2023, All Rights Reserved.</b></div>
    </div>
  );
}

export default App;
