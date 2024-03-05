import styled from 'styled-components';
const me = require('../../img/me-reversed.webp');

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px;
  @media (min-width: 1024px) {
    padding: 0;
  }
`;

const StyledLink = styled.a`
margin: 0px 3px;
color: black;
text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &.mr-1 {
    margin-right: 1rem;
  }
  &.underline {
    text-decoration: underline;
  }
`;

const LogoImage = styled.img`
  width: 75px;
  height: 75px;
  margin: 0px 2px;
`;

function Attribution() {
    return (
        <Container>
            By
            <StyledLink
                href='https://justben.fyi'
                target="_blank"
                rel="noopener noreferrer"
            >
                justben.fyi
            </StyledLink>
            <LogoImage
                src={me}
                alt="justben.fyi logo"
            />
        </Container>
    );
}

export default Attribution;
