import { useState } from 'react';
import { Button } from '@mui/material';
import { useQuery } from 'react-query';
import { round } from './helpers';
import styled, { createGlobalStyle } from 'styled-components';
import { Form } from './components/form';
import { Disclaimer } from './components/disclaimer';
import { Footer } from './components/footer';
import { Result } from './components/result';

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

const Title = styled.h1`
margin: 50px 0px 10px 0px;
font-size: 40px;
color: rgb(121, 121, 121);
`

const Subtitle = styled.p`
margin: 0px 40px 30px 40px;
`

function App() {
  const [coin, setCoin] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
  const [localizedPurchaseDate, setLocalizedPurchaseDate] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0)
  const [isThrottled, setIsThrottled] = useState<boolean>(false);

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
        const price = result["Time Series (Digital Currency Daily)"][localizedPurchaseDate || ""]['4b. close (USD)'];
        if (!!price) {
          return round(parseFloat(price) * amount);
        } else {
          throw new Error(`Failed to parse price for ${coin} on ${localizedPurchaseDate}`);
        }
      }
    }
  };

  const { isFetching, error, data, refetch } = useQuery('cryptoPrices', fetchPrice, { enabled: false });
  const isButtonDisabled = coin === '' || !purchaseDate || !amount || isFetching || isThrottled;

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Title>CRYPTO COST BASIS ENGINE</Title>
        <Subtitle>A good way to guess what that NFT cost you last year.</Subtitle>
        <img src={photo} height='175' alt='accountant logo' />
        <Form
          coin={coin}
          purchaseDate={purchaseDate}
          setAmount={setAmount}
          setCoin={setCoin}
          setPurchaseDate={setPurchaseDate}
          setLocalizedPurchaseDate={setLocalizedPurchaseDate}
        />
        <Button
          disabled={isButtonDisabled}
          size='large'
          variant='contained'
          onClick={() => refetch()}>
          Get Estimate
        </Button>
        <Result 
          data={data}
          isFetching={isFetching}
          isThrottled={isThrottled}
          error={error}
        />
        <Footer />
        <Disclaimer />
      </AppContainer>
    </>
  );
}

export default App;
