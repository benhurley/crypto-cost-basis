import styled from "styled-components"
import { CircularProgress } from "@mui/material"

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

const Throttled = styled.span`
color: red;
font-weight: bold;
`

const Loading = styled.span`
padding-left: 25px;
padding-right: 25px;
`

type ResultProps = {
    data: number | undefined,
    isFetching: boolean,
    isThrottled: boolean,
}

export const Result = ({
    data, 
    isFetching, 
    isThrottled
} : ResultProps) => {
    return (
        <Container>
            {isFetching &&
                <Loading>
                    <CircularProgress color="success" size={20} />
                </Loading>
            }
            {data && !isFetching &&
                <Dollars>
                    {`Estimate: $${data || 0} USD`}
                </Dollars>
            }
            {isThrottled &&
                <Throttled>Throttled: Max 5 requests per minute.</Throttled>
            }
        </Container>
    );
}