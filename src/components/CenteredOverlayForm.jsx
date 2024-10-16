import { Button, Container, Row, Form } from "react-bootstrap"
import styled from "styled-components"
import { OverlayWrapper } from "./shared/OverlayWrapper"
import { ServiceLogo } from "./ServiceLogo"

export const CenteredOverlayForm = ({ title, children, validated, handleSubmit }) => {
    return (
        <StyledCentralizedContainer>
            <ServiceLogo />
            <OverlayWrapper>
                <Container>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <StyledCentralizedContent>
                            <Row>
                                <StyledTitle>{ title }</StyledTitle>
                            </Row>
                            <Row>
                                { children }
                            </Row>
                            <Row>
                                <StyledButton>저장</StyledButton>
                            </Row>
                        </StyledCentralizedContent>
                    </Form>
                </Container>
            </OverlayWrapper>
        </StyledCentralizedContainer>
    )
}

const StyledCentralizedContainer = styled(Container)`
    width: 50vw;
    min-height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 10px;
`



const StyledCentralizedContent = styled(Row)`
    height: 60vh;
    align-items: center;
    justify-content: center;
`

const StyledButton = styled(Button).attrs({
    type: 'submit'
})`
    width: 60%;
    margin: 0 auto;
    background-color: #6610F2;
    border-radius: 8px;
    border: none;

    &:hover{
        background-color: #6610F2;
        filter: brightness(80%);
    }
`

const StyledTitle = styled.h2`
    font-weight: 700;
    line-height: 35px;
    text-align: right;
    overflow-wrap: break-word;
    word-break: keep-all;
`