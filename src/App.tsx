import { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { useQuery } from 'react-query';
import { round } from './helpers';
import styled, { createGlobalStyle } from 'styled-components';
import { RequestForm } from './components/requestForm';
import { Disclaimer } from './components/disclaimer';
import { Footer } from './components/footer';
import { Result } from './components/result';
import isBefore from 'date-fns/isBefore';
import { AlphaVantageContext, PurchaseDataContext } from './contexts';

const photo = require('./img/nerd.png');

interface ApiResult {
  "Time Series (Digital Currency Daily)"?: {
    [date: string]: {
      "1a. open (USD)": string;
      "1b. open (USD)": string;
      "2a. high (USD)": string;
      "2b. high (USD)": string;
      "3a. low (USD)": string;
      "3b. low (USD)": string;
      "4a. close (USD)": string;
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

const Title = styled.h1`
margin: 50px 0px 10px 0px;
font-size: 40px;
color: rgb(121, 121, 121);
`

const Subtitle = styled.p`
margin: 0px 40px 30px 40px;
`

const InputError = styled.p`
color: red;
margin: 30px;
`

function App() {
  const [coin, setCoin] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
  const [localizedPurchaseDate, setLocalizedPurchaseDate] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null)
  const [isThrottled, setIsThrottled] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const firstAvailableDate: Date = useMemo(() => new Date('June 4, 2020'), []); // earliest date api supports
  const isOutOfRangeDate = !!purchaseDate && isBefore(new Date(purchaseDate), firstAvailableDate)

  const handleThrottle = () => {
    setIsThrottled(true);
    setTimeout(() => {
      setIsThrottled(false);
    }, 60000);
  }

  const fetchPrice = async () => {
    if (coin !== "") {
      const cryptoPriceApi = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${coin}&market=USD&apikey=B51E4JGUNRQKOGTH`;
      const res = await fetch(cryptoPriceApi);
      const result: ApiResult = await res.json();

      if (!!result && result['Note']) {
        handleThrottle();
      } else if (!!result && result["Time Series (Digital Currency Daily)"]) {
        const price = result["Time Series (Digital Currency Daily)"][localizedPurchaseDate || ""]['4b. close (USD)'];
        if (!!price && !!amount) {
          return round(parseFloat(price) * amount);
        } else {
          throw new Error(`Failed to parse price for ${coin} on ${localizedPurchaseDate}`);
        }
      }
    }
  };

  const { isFetching, error, data, refetch } = useQuery('cryptoPrices', fetchPrice, { enabled: false });
  const isEstimateButtonDisabled = coin === '' || !purchaseDate || isOutOfRangeDate || !amount || amount <= 0 || isFetching || isThrottled;

  useEffect(() => {
    if (!!coin && !!amount && isOutOfRangeDate) {
      setInputError(`Must be a date after ${firstAvailableDate.toString().slice(0, 15)}`)
    } else if (amount !== null && amount <= 0) {
      setInputError('Quantity must be a positive value')
    } else {
      setInputError(null)
    }
  }, [amount, coin, isOutOfRangeDate, firstAvailableDate])

  return (
    <AlphaVantageContext.Provider value={{ data, error, isFetching, isThrottled }}>
      <PurchaseDataContext.Provider value={{ coin, firstAvailableDate, purchaseDate, setAmount, setCoin, setLocalizedPurchaseDate, setPurchaseDate }}>
        <GlobalStyle />
        <AppContainer>
          <Title>CRYPTO COST-BASIS ENGINE</Title>
          <Subtitle>A good way to guess what that NFT cost you last year.</Subtitle>
          <img src={photo} height='175' alt='accountant logo' />
          <RequestForm />
          {inputError && <InputError>{inputError}</InputError>}
          <Button
            disabled={isEstimateButtonDisabled}
            size='large'
            variant='contained'
            onClick={() => refetch()}>
            Get Estimate
          </Button>
          <Result />
          <Footer />
          <Disclaimer />
        </AppContainer>
      </PurchaseDataContext.Provider>
    </AlphaVantageContext.Provider>
  );
}

export default App;
