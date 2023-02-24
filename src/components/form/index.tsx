import styled from 'styled-components';
import { TextField } from '@mui/material';
import { Select } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import { Dispatch, SetStateAction } from 'react';

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


const Amount = styled.span`
max-width: 125px;
`

const Container = styled.span`
min-width: 100px;
padding-left: 10px;
padding-right: 10px;
`

type FormProps = {
    coin: string,
    purchaseDate: string | null,
    setAmount: Dispatch<SetStateAction<number>>,
    setCoin: Dispatch<SetStateAction<string>>,
    setPurchaseDate: Dispatch<SetStateAction<string | null>>,
}

export const Form = ({ 
    coin, 
    purchaseDate, 
    setAmount, 
    setCoin, 
    setPurchaseDate 
} : FormProps) => {
    const applyNewDate = (value: Date | null) => {
        if (!!value) {
            const dateString = value.toISOString().slice(0, 10);
            setPurchaseDate(dateString);
        }
    }

    return (
        <Header>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    disableFuture
                    openTo="year"
                    views={['year', 'day']}
                    label='Date*'
                    value={purchaseDate}
                    maxDate={new Date()}
                    onChange={(newValue) => {
                        applyNewDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <Container>
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
            </Container>
            <Amount>
                <TextField
                    type='number'
                    label={'Amount'}
                    onChange={(event) => setAmount(parseFloat(event.target.value))}
                    required />
            </Amount>
        </Header>
    )
}