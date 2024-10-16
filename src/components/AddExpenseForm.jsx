import { useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { groupMembersState } from "../state/groupMembers"
import { expensesState } from "../state/expenses"
import styled from "styled-components"

export const AddExpenseForm = () => {
    const members = useRecoilValue(groupMembersState)
    const [validated, setValidated] = useState(false)
    const setExpense = useSetRecoilState(expensesState)

    // Invalid state - expense description, expense amount, payer
    const [isDescValid, setIsDescValid] = useState(false)
    const [isAmountValid, setIsAmountValid] = useState(false)
    const [isPayerValid, setIsPayerValid] = useState(false)

    // Setting an state about inputs
    const today = new Date()
    const year = today.getFullYear()
    const month = (today.getMonth()+1).toString().padStart(2, '0')
    const day = (today.getDate()).toString().padStart(2, '0')
    const [date, setDate] = useState([year, month, day].join('-'))
    const [desc, setDesc] = useState('')
    const [amount, setAmount] = useState(0)
    const [payer, setPayer] = useState(null)

    const checkFormValidity = () => {
        const descValid = desc.length > 0
        const amountValid = amount > 0
        const payerValid = payer !== null

        setIsDescValid(descValid)
        setIsAmountValid(amountValid)
        setIsPayerValid(payerValid)

        return descValid && amountValid && payerValid
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(checkFormValidity()){
            const newExpense = {
                date, desc, amount, payer
            }

            setExpense(expense => [
                ...expense, 
                newExpense
            ])
        }
        setValidated(true)
    }

    return (
        <StyledWrapper>
            <Form validated={validated} onSubmit={handleSubmit}>
                <StyledTitle>1. 비용 추가하기</StyledTitle>
                <Row>
                    <Col xs={12}>
                        <StyledFormGroup>
                            <Form.Control 
                                type='date'
                                placeholder='결제한 날짜를 선택해 주세요'
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </StyledFormGroup>
                    </Col>
                </Row>
                
                <Row>
                    <Col xs={12}>
                        <StyledFormGroup>
                            <Form.Control 
                                type='text'
                                placeholder='비용에 대한 설명을 입력해 주세요'
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                isValid={isDescValid}
                                isInvalid={validated && !isDescValid}
                            />
                            <Form.Control.Feedback
                                type="invalid"
                                data-valid={isDescValid}
                            >
                                비용 내용을 입력해주세요.
                            </Form.Control.Feedback>
                        </StyledFormGroup>
                    </Col>   
                </Row>

                <Row>
                    <Col xs={12} lg={6}>
                        <StyledFormGroup>
                            <Form.Control 
                                type='number'
                                placeholder='비용은 얼마였나요?'
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                isValid={isAmountValid}
                                isInvalid={validated && !isAmountValid}
                            />
                            <Form.Control.Feedback 
                                type="invalid"
                                data-valid={isAmountValid}    
                            >
                                금액을 입력해주세요.
                            </Form.Control.Feedback>
                        </StyledFormGroup>
                    </Col>
                    
                    <Col xs={12} lg={6}>
                        <StyledFormGroup>
                            <Form.Select
                                defaultValue=''
                                value={payer}
                                onChange={(e) => setPayer(e.target.value)}
                                isValid={isPayerValid}
                                isInvalid={validated && !isPayerValid}
                            >
                                <option disabled value=''>누가 결제 했나요?</option>
                                {/* <option>A</option>
                                <option>B</option>
                                <option>C</option>
                                <option>D</option> */}
                                {/* <option value='영수'>영수</option> */}
                                {members.map(member => 
                                    <option key={member} value={member}>{ member }</option>
                                )}
                            </Form.Select>
                            <Form.Control.Feedback
                                type="invalid"
                                data-valid={isPayerValid}
                            >
                                결제자를 선택해주세요.
                            </Form.Control.Feedback>
                        </StyledFormGroup>
                    </Col>
                </Row>
                
                <Row>
                    <Col xs={12}>
                        <StyledSubmitButton>추가하기</StyledSubmitButton>
                    </Col>
                </Row>
            </Form>
        </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
    padding: 50px;
    border-radius: 15px;
    background: #683BA1;
    box-shadow: 3px 0px 4px 0px rgba(0, 0, 0, 0.25);
`

const StyledFormGroup = styled(Form.Group)`
    margin-bottom: 18px;

    input, select {
        border-radius: 8px;
        border: 0;
        background: #59359A;
        box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
        color: #F8F9FA;
        height: 45px;

        &:focus {
            color: #F8F9FA;
            background: #59359A;
            filter: brightness(80%);
        }
    }

    input::placeholder, select::placeholder {
        color: #F8F9FA;
    }
`

export const StyledTitle = styled.h3`
    color: #FFFBFB;
    text-align: center;
    font-weight: 700;
    font-size: 40px;
    line-height: 48px;
    letter-spacing: 0.25px;
    margin-bottom: 15px;
`

const StyledSubmitButton = styled(Button).attrs({
    type:'submit'
})`
    width: 100%;
    height: 60px;
    padding: 16px 32px;
    border: none;
    border-radius: 8px;
    background-color: #E2D9F3;
    gap: 8px;
    color: #59359A;

    &:hover, &:focus {
        background-color: #E2D9F3;
        filter: rgba(0, 0, 0, 0.2);
    }
`