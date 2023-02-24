import styled from "styled-components"

const Container = styled.div`
text-align: center;
margin-top: 30px;
font-size: 12px;
margin-left: 50px;
margin-right: 50px;
margin-bottom: 30px;
`

const Link = styled.a`
color: black;
`

export const Footer = () => {
    return (
        <Container>
            Created with ♥ by {" "}
                <Link target="_blank" rel="noopener noreferrer" href="https://justben.fyi">
                    Ben
                </Link>
            . 2023, All Rights Reserved.
        </Container>
    )
}