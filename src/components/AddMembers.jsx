import { useState } from "react"
import { CenteredOverlayForm } from "./CenteredOverlayForm"
import { InputTags } from "react-bootstrap-tagsinput"
import { useRecoilState, useRecoilValue } from "recoil"
import { groupMembersState } from "../state/groupMembers"
import { groupNameState } from "../state/groupName"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../routes"
import { Form } from "react-bootstrap"

export const AddMembers = () => {
    const groupName = useRecoilValue(groupNameState)
    const [validated, setValidated] = useState(false)
    const [groupMembersString, setGroupMembersString] = useState('')
    const [groupMembers, setGroupMembers] = useRecoilState(groupMembersState)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setValidated(true)
        if(groupMembers.length > 0){
            navigate(ROUTES.EXPENSE_MAIN)
        } else if(isSamsungInternet() && groupMembersString.length > 0){
            // string > parse > array
            setGroupMembers(groupMembersString.split(','))
        }
    }
    
    // TODO Performance Optimazation Issue
    const isSamsungInternet = () => {
        return window.navigator.userAgent.includes("SAMSUNG") || window.navigator.userAgent.includes("SamsungBrowser")
    }

    const header = `${groupName} 그룹에 속한 사람들의 이름을 모두 적어주세요.`

    return (
        <CenteredOverlayForm
            title={header}
            validated={validated}
            handleSubmit={handleSubmit}
        >

            { isSamsungInternet() ? 
            <Form.Control 
                type="text" 
                placeholder="이름 간 컴마(,)로 구분"
                onChange={(e) => setGroupMembersString(e.target.value)}
            /> :
            <InputTags 
                    data-testid="input-member-names"
                    placeholder="이름 간 띄어쓰기" 
                    onTags={(value) => setGroupMembers(value.values)}
            />
            }
            
            {validated && groupMembers.length === 0 && (
                <StyledErrorMessage>그룹 멤버들의 이름을 입력해주세요.</StyledErrorMessage>
            )}
        </CenteredOverlayForm>
    );
}

const StyledErrorMessage = styled.span`
    color: red;
`