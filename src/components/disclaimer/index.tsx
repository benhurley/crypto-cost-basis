import styled from "styled-components";

const Container = styled.div`
text-align: left;
margin-top: 30px;
font-size: 10px;
margin: 50px auto 50px auto;
max-width: 900px;
padding: 0px 20px 0px 20px;
`
const Copy = styled.div`
margin-bottom: 10px;
`

export const Disclaimer = () => {
    return (
        <Container>
            <Copy>
                Disclaimer: The information provided on this website is for educational purposes only and should not be construed as financial or investment advice. We provide cost basis estimations based on historical price data in cryptocurrencies, which is subject to market volatility and may not be accurate at the time of your transaction. You should always conduct your own research and seek professional advice before making any financial decisions. We do not guarantee the accuracy or completeness of the information on this site and are not liable for any errors or omissions, or for any losses or damages resulting from the use of this information. By using this site, you acknowledge and agree that you are solely responsible for any investment decisions you make based on the information provided.
            </Copy>
            <Copy>
                Data source: <a target="_blank" rel="noopener noreferrer" href='https://www.alphavantage.co/'>alphavantage.co</a>, a free api for historical crypto prices. Estimates are given based on the closing price of the asset on the given day.
            </Copy>
        </Container>
    );
}