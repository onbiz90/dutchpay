import { Col, Container, Row } from "react-bootstrap"
import { AddExpenseForm } from "./AddExpenseForm"
import { ExpenseTable } from "./ExpenseTable"
import styled from "styled-components"
import { useRecoilValue } from "recoil"
import { groupNameState } from "../state/groupName"
import { SettlementSummary } from "./SettlementSummary"
import { ServiceLogo } from "./ServiceLogo"

export const ExpenseMain = () => {
    return (
        <Container fluid>
            <Row>
                <Col xs={12} sm={5} md={5}>
                    <LeftPane/>
                </Col>
                <Col>
                    <RightPane/>
                </Col>
            </Row>
        </Container>
    )
}

const LeftPane = () => {
    return (
        <Container>
            <StyledGapRow>
                <Row>
                    <ServiceLogo/>
                </Row>
                <Row>
                    <AddExpenseForm/>
                </Row>
                <Row>
                    <SettlementSummary/>
                </Row>
            </StyledGapRow>
        </Container>
    )
}

const RightPane = () => {
    const groupName = useRecoilValue(groupNameState)
    
    return (
        <StyledRightPaneWrapper>
            <Row>
                <StyledGroupName>{ groupName || "Group Name"}</StyledGroupName>
            </Row>
            <Row>
                <ExpenseTable/>    
            </Row>
        </StyledRightPaneWrapper>
    )
}

const StyledRightPaneWrapper = styled(Container)`
    padding: 100px 31px;
`

const StyledGroupName = styled.h2`
    margin-bottom: 80px;
    font-weight: 700;
    font-size: 48px;
    line-height: 48px;
    text-align: center;
`

const StyledGapRow = styled(Row)`
    gap: 5vh;
    padding-top: 100px;
    justify-content: center;
`