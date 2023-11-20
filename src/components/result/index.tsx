import styled from "styled-components"
import { CircularProgress } from "@mui/material"
import { useContext } from "react"
import { AlphaVantageContext, TAlphaVantageContext } from "../../contexts"

const Container = styled.div`
margin-top: 30px;
margin-bottom: 50px;
font-size: 20px;
color: rgb(121, 121, 121);
`

const Dollars = styled.span`
color: green;
font-weight: bold;
`

const Warning = styled.div`
color: red;
font-weight: bold;
margin: 10px;
`

const Loading = styled.div`
padding-left: 25px;
padding-right: 25px;
`

export const Result = () => {
    const { data, error, isFetching, isThrottled } = useContext<TAlphaVantageContext>(AlphaVantageContext);
    return (
        <Container>
            {isFetching &&
                <Loading>
                    <CircularProgress color="success" size={20} />
                </Loading>
            }
            {data && !isFetching && !error &&
                <Dollars>
                    {`Estimate: $${data || 0} USD`}
                </Dollars>
            }
            {isThrottled &&
                <Warning>Max 5 requests per minute.</Warning>
            }
            {error &&
                <Warning>Error: Daily limit may have been reached, check console for details.</Warning>
            }
        </Container>
    );
}