import { useState } from 'react';
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
import { useQuery } from 'react-query';
import { round } from './helpers';
import styled, { createGlobalStyle } from 'styled-components';

const photo = require('./img/nerd.png');

interface ApiResult {
  "Time Series (Digital Currency Daily)"?: {
    [date: string]: {
      "1a. open (CNY)": string;
      "1b. open (USD)": string;
      "2a. high (CNY)": string;
      "2b. high (USD)": string;
      "3a. low (CNY)": string;
      "3b. low (USD)": string;
      "4a. close (CNY)": string;
      "4b. close (USD)": string;
      "5. volume": string;
      "6. market cap (USD)": string;
    }
  };
  "Note"?: string;
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const AppContainer = styled.div`
text-align: center;
font-family: 'Courier New', Courier, monospace;
`

const Header = styled.header`
display: flex;
flex-direction:row;
align-items: center;
justify-content: center;
font-size: calc(10px + 2vmin);
color: white;
margin-top: 5px;
margin-bottom: 30px;
margin-left: 15px;
margin-right: 15px;
`

const Result = styled.div`
margin-top: 30px;
font-size: 20px;
color: rgb(121, 121, 121);
`

const Amount = styled.span`
max-width: 125px;
`

const Form = styled.span`
min-width: 100px;
padding-left: 10px;
padding-right: 10px;
`

const Title = styled.h1`
margin: 50px 0px 10px 0px;
font-size: 40px;
color: rgb(121, 121, 121);
`

const Subtitle = styled.p`
margin: 0px 40px 30px 40px;
`

const Dollars = styled.span`
color: green;
font-weight: bold;
`

const Throttled = styled.span`
color: red;
font-weight: bold;
`

const Disclaimer = styled.div`
text-align: center;
margin-top: 30px;
font-size: 10px;
margin-left: 50px;
margin-right: 50px;
`

const Footer = styled.div`
text-align: center;
margin-top: 30px;
font-size: 10px;
margin-left: 50px;
margin-right: 50px;
margin-bottom: 30px;
`

const Loading = styled.span`
padding-left: 25px;
padding-right: 25px;
`

function App() {
  const [coin, setCoin] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0)
  const [isThrottled, setIsThrottled] = useState<boolean>(false);

  const applyNewDate = (value: Date | null) => {
    if (!!value) {
      const dateString = value.toISOString().slice(0, 10);
      setPurchaseDate(dateString);
    }
  }

  const handleThrottle = () => {
    setIsThrottled(true);
    setTimeout(() => {
      setIsThrottled(false);
    }, 60000);
  }

  const fetchPrice = async () => {
    if (coin !== "") {
      const cryptoPriceApi = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${coin}&market=CNY&apikey=B51E4JGUNRQKOGTH`;
      const res = await fetch(cryptoPriceApi);
      const result: ApiResult = await res.json();

      if (!!result && result['Note']) {
        handleThrottle();
      } else if (!!result && result["Time Series (Digital Currency Daily)"]) {
        const price = result["Time Series (Digital Currency Daily)"][purchaseDate || ""]['4b. close (USD)'];
        if (!!price) {
          return round(parseFloat(price) * amount);
        } else {
          throw new Error(`Failed to parse price for ${coin} on ${purchaseDate}`);
        }
      }
    }
  };

  const { isFetching, error, data, refetch } = useQuery('cryptoPrices', fetchPrice, { enabled: false });
  const isButtonDisabled = coin === '' || !purchaseDate || !amount || isFetching || isThrottled;

  if (error) {
    throw new Error(`API call for historical ${coin} price data failed`);
  }

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Title>CRYPTO COST BASIS ENGINE</Title>
        <Subtitle>A good way to guess what that NFT cost you last year.</Subtitle>
        <img src={photo} height='175' alt='accountant logo' />
        <Header>
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
          <Form>
            <FormControl fullWidth>
              <InputLabel required id='demo-simple-select-label'>Coin</InputLabel>
              <Select
                id='select-crypto'
                value={coin}
                label='Coin'
                onChange={(event) => setCoin(event.target.value)}
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
          </Form>
          <Amount>
            <TextField
              type='number'
              label={'Amount'}
              onChange={(event) => setAmount(parseFloat(event.target.value))}
              required />
          </Amount>
        </Header>
        <Button
          disabled={isButtonDisabled}
          size='large'
          variant='contained'
          onClick={() => refetch()}>
          Get Estimate
        </Button>
        <Result>
          {`Estimation: `}
          {isFetching &&
            <Loading>
              <CircularProgress color="success" size={20} />
            </Loading>
          }
          {data && !isFetching &&
            <Dollars>
              {`$${data || 0} USD`}
            </Dollars>
          }
          {isThrottled &&
            <Throttled>Throttled: Max 5 requests per minute.</Throttled>
          }
        </Result>
        <Disclaimer>
          Disclaimer: The information provided on this website is for educational purposes only and should not be construed as financial or investment advice. We provide cost basis estimations based on historical price data in cryptocurrencies, which is subject to market volatility and may not be accurate at the time of your transaction. You should always conduct your own research and seek professional advice before making any financial decisions. We do not guarantee the accuracy or completeness of the information on this site and are not liable for any errors or omissions, or for any losses or damages resulting from the use of this information. By using this site, you acknowledge and agree that you are solely responsible for any investment decisions you make based on the information provided.
        </Disclaimer>
        <Disclaimer>
          Data source: <a target="_blank" rel="noopener noreferrer" href='https://www.alphavantage.co/'>alphavantage.co</a>, a free api for historical crypto prices. Estimates are given based on the closing price of the asset on the given day.
        </Disclaimer>
        <Footer><b>Created with ♥ by <a target="_blank" rel="noopener noreferrer" href="https://justben.fyi">Ben</a>. 2023, All Rights Reserved.</b></Footer>
      </AppContainer>
    </>
  );
}

export default App;
