import { useRecoilValue } from "recoil"
import { expensesState } from "../state/expenses"
import { groupMembersState } from "../state/groupMembers"
import styled from "styled-components"
import { StyledTitle } from "./AddExpenseForm"
import { Button } from "react-bootstrap"
import { toPng } from "html-to-image"
import { useRef } from "react"
import { ArrowRight, CloudDownload, Download, FileArrowDown } from "react-bootstrap-icons"

const calculateMinimumTransaction = (expenses, members, amountPerPerson) => {
    const membersToPay = {}
    const minTransctions = []

    if (amountPerPerson === 0) {
        return minTransctions    
    }

    // 1. 사람마다 냈어야 하는 금액 구하기
    members.forEach((member) => (
        membersToPay[member] = amountPerPerson
    ))

    expenses.forEach(({ date, desc, amount, payer }) => (
        membersToPay[payer] -= amount
    ))

    // 2. amount를 기준으로 오름차순 정렬하기
    const sortedMembersToPay = Object.keys(membersToPay)
        .map(member => (
            { member: member, amount: membersToPay[member] }
        ))
        .sort((a, b) => a.amount - b.amount)

    // 3. minimumTransaction 만들기
    let left = 0
    let right = sortedMembersToPay.length - 1

    while (left < right){
        while (left < right && sortedMembersToPay[left].amount === 0) {
            left += 1
        }

        while (left < right && sortedMembersToPay[right].amount === 0) {
            right -= 1
        }
        
        const toReceive = sortedMembersToPay[left]
        const toSend = sortedMembersToPay[right]
        const amontToReceive = Math.abs(toReceive.amount)
        const amontToSend = Math.abs(toSend.amount)

        if (amontToSend > amontToReceive){
            minTransctions.push({
                receiver: toReceive.member,
                sender: toSend.member,
                amount: amontToReceive
            })

            toReceive.amount = 0
            toSend.amount -= amontToReceive
            left += 1
        } else {
            // ex. amontToSend(1000) <= amontToReceive(-2000)
            minTransctions.push({
                receiver: toReceive.member,
                sender: toSend.member,
                amount: amontToSend
            })

            toSend.amount = 0
            toReceive.amount += amontToSend
            right -= 1
        }
    }

    return minTransctions
}

export const SettlementSummary = () => {
    const wrapperElement = useRef(null)
    
    const expenses = useRecoilValue(expensesState)
    const totalExpenseAmount = parseInt(
        expenses.reduce((prevAmount, curExpense) => (prevAmount + parseInt(curExpense.amount)), 0))
    const members = useRecoilValue(groupMembersState)
    // const members = ['A', 'B', 'C', 'D']
    const groupMembersCount = members.length
    const splitAmount = totalExpenseAmount / groupMembersCount
    
    const minimumTransaction = calculateMinimumTransaction(expenses, members, splitAmount)

    // const minimumTransaction = [
    //     {
    //         receiver: '영수',
    //         sender: '영희',
    //         amount: '15000'
    //     },
    // ]

    // const buttonFilter = (btnElement) => {
    //     const exclusionClasses = ['download-btn']
    //     return !exclusionClasses.some((classname) => btnElement.classList?.contains(classname))
    // }

    const exportToImage = () => {
        if(wrapperElement.current === null){
            return
        }
        
        toPng(wrapperElement.current, {
            filter: (node) => node.tagName !== 'BUTTON'
        })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = 'settlement-summary.png'
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {
                console.error(err)
            })
    }

    return (
        <StyledWrapper ref={wrapperElement}>
            <StyledTitle>2. 정산은 이렇게</StyledTitle>
            { totalExpenseAmount > 0 && groupMembersCount > 0 && (
                <>
                    <StyledSummary>
                        <span>{groupMembersCount} 명이서 총 {totalExpenseAmount} 원 지출</span>
                        <br />
                        <span>한 사람 당 {splitAmount} 원</span>
                    </StyledSummary>
                    
                    <StyledUl>
                        {minimumTransaction.map(({receiver, sender, amount}, idx) => (
                            <li key={`transaction - ${idx}`}>
                                <span>{sender}가 {receiver}에게 {amount}원</span>
                            </li>
                        ))}
                    </StyledUl>
                    <StyledButton data-testid='btn-download' onClick={exportToImage}>
                        <Download/>
                    </StyledButton>
                    
                </>
            )}     
        </StyledWrapper>
    )
}

const StyledButton = styled(Button)`
    font-size: 25px;
    background: none;
    border: none;
    position: absolute;
    top: 15px;
    right: 15px;

    &:hover, &:active{
        background: none;
        color: #683BA1;
    }
`

const StyledWrapper = styled.div`
    padding: 50px;
    background-color: #683BA1;
    color: #FFFBFB;
    box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    text-align: center;
    font-size: 22px;
    position: relative;
`

const StyledSummary = styled.div`
    margin-top: 31px;
`

const StyledUl = styled.ul`
    margin-top: 31px;
    font-weight: 600;
    line-height: 48px;

    list-style-type: disclosure-closed;
    li::marker{
        animation: blinker 2s linear infinite;
    }

    @keyframes blinker{
        50% {
            opacity: 0;
        }
    }
`