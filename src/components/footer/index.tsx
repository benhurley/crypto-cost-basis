import styled from "styled-components"
import Attribution from "../attribution"

const Container = styled.div`
display: flex;
justify-content: center;
text-align: center;
margin-top: 80px;
font-size: 12px;
margin-left: 50px;
margin-right: 50px;
margin-bottom: 30px;
`

export const Footer = () => {
    return (
        <Container>
            <Attribution />
        </Container>
    )
}