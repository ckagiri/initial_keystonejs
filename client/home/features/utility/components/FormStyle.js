import styled from 'styled-components';
import React from 'react';
import 'react-select/dist/react-select.css';

const FormContainer = styled.div`
    margin-bottom: 10px;
    position: relative;
`;

const TextFormContainer = styled(FormContainer)`
    display: ${props => (props.display ? props.display : 'inline-block')};
    width: ${props => (props.width ? props.width : '100%')};
    margin-right: ${props => (props.margin_right ? props.margin_right : '0')};
    margin: ${props => (props.margin ? props.margin : null)};
    input[type='text']{
        vertical-align: text-bottom;
    }
`;

const CheckboxFormContainer = styled.label`
    margin-top: 10px;
    margin-bottom: 10px;
    span {
        color: #7e7d7d;
    }
    > div {
        width: 100%;
    }
    > input {
        opacity: 0;
        position: absolute;
        :checked {
            & + div {
                > div {
                    > img {
                        opacity: 1;
                    }
                }
            }
        }
    }
`;
const DropZoneContainer = styled.div`
    width: 100%;
    height: 100%;
    div {
        width: 100%;
        height: 100%;
    }
`;
const SelectFormContainer = styled(FormContainer)``;

const BasicStyle = styled.div`
    background: #090909;
    width: 100%;
    border: 0;
`;

const BasicInput = BasicStyle.withComponent('input');
const Input = BasicInput.extend`
    width: 100%;
    color: #ffffff;
    text-indent: 20px;
    border-radius: 3px;
    height: ${props => (props.height ? props.height : '42px')};
    border: ${props => (props.error ? `1px solid #FD3A3A` : `0`)};
    font-size: ${props => (props.fontSize ? props.fontSize : '15px')};
    position: relative;
    flex: 1;
`;

const Placeholder = styled.div`
    position: absolute;
    left: 20px;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #7e7d7d;
    pointer-events: none;
    display: ${props => (props.show ? 'block' : 'none')};
    font-size: ${props => (props.fontSize ? props.fontSize : '15px')};
    img {
        width: 16px;
        margin-right: 5px;
    }
    /* ${props => props.text ? null : 'top: 30%'}; */
`;

const InputContainer = styled.div`
    position: relative;
    flex: 1;
`

const SelectPlaceholder = styled.div`
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #7e7d7d;
    pointer-events: none;
    display: ${props => (props.show ? 'block' : 'none')};
    font-size: ${props => (props.fontSize ? props.fontSize : '15px')};
`;

const BasicSubmit = BasicStyle.withComponent('input');
const Submit = BasicSubmit.extend`background: #fd3a3a;`;

// const BasicFile = BasicStyle.withComponent('input');
const FileInput = styled.input.attrs({
    type: 'file'
})`
    display: block;
`;

// const BasicSelect = BasicStyle.withComponent('select');
// const Select = BasicSelect.extend`
//     background: red;
// `;
const FieldHeader = styled.p`
    margin: 0;
    margin-bottom: 2px;
    font-size: ${props => (props.headerFontSize ? props.headerFontSize : '15px')};
`

const Remark = styled.b`
    margin: 0;
    margin-bottom: 2px;
    font-size: ${props => (props.headerFontSize ? props.headerFontSize : '15px')};
    color: #FF0000;
    font-weight: 1;
`

const Unit = styled.div`
    position: relative;
    margin-left: 10px;
    min-width: 15px;
    color: ${props => props.unit_color ? props.unit_color : 'white'};
    p{
        top: 50%;
        transform: translateY(50%);
    }
`

const FlexWrapper = styled.div`
    display: flex;
    width: ${props => props.width ? props.width : '100%'};
    flex-direcetion: ${props => props.flex_direction ? props.flex_direction : null};
`

const BasicTextarea = BasicStyle.withComponent('textarea');
const Textarea = BasicTextarea.extend`
    height: ${props => (props.height ? props.height : '180px')};
    font-size: ${props => (props.fontSize ? props.fontSize : '15px')};
    padding: 20px;
    resize: none;
`;

// const BasicCheckbox = BasicStyle.withComponent('input');
const CheckboxInput = styled.input.attrs({
    type: 'checkbox'
})`
    opacity: 0;
    position: absolute;
`;

const Checkbox = styled.div`
    width: 18px;
    height: 18px;
    margin-right: 10px;
    border: 1px solid #fd3a3a;
    border-radius: 4px;
    display: inline-block;
    vertical-align: middle;

    > img {
        height: 100%;
        opacity: 0;
        transition: opacity 0.2s;
    }
`;
const CheckBoxInline = styled.div`
    div,
    span {
        display: inline-block;
    }
`;

import ReactSelect from 'react-select';
import Dropzone from 'react-dropzone';

const SelectContainer = styled(FormContainer)`
    width: ${props => (props.width ? props.width : '100%')};
    display: ${props => (props.display ? props.display : 'block')};
    margin-right: ${props => props.margin_right ? props.margin_right : '0'};
    margin: ${props => props.margin ? props.margin : null};
`

const Select = styled(ReactSelect)`
    &.Select{
        border: ${props => (props.error ? `1px solid #FD3A3A` : `0`)};
        padding: ${props => (props.error ? `1px` : `0`)};
        /* width: ${props => (props.width ? props.width : '100%')}; */
        /* margin-right: ${props => props.margin_right ? props.margin_right : '0'}; */
        /* display: inline-block; */
        .Select-control,  .Select-option{
            background: ${props => props.background ? props.background : '#090909'};
            border: 0;
            color: ${props => props.color ? props.color : '#FFFFFF'};
            height: ${props => props.height ? props.height : '42px;'};
        }
        .Select-placeholder{
            background: ${props => props.background ? props.background : '#111111'};
            color: ${props => props.color ? props.color : '#FFFFFF'};
            height: ${props => props.height ? props.height : '42px;'};
        }
        .Select-value{
            background: ${props => props.background ? props.background : '#111111'};
            line-height: ${props => props.height ? props.height : '42px;'};
            color: ${props => props.color ? props.color : '#FFFFFF'};
            text-indent: 10px;
            height: ${props => props.height ? props.height : '42px;'};
            .Select-value-label{
                color: ${props => props.color ? `${props.color} !important;` : '#FFFFFF !important;'};
                height: ${props => props.height ? props.height : '42px;'};
                font-size: ${props => props.fontSize ? `${props.fontSize}` : '14px'};
                line-height: ${props => props.height ? props.height : '42px;'};
            }
        }
        .Select-clear-zone{
            display: ${props => (props.value ? 'table-cell' : 'none')};
        }
    }
    .Select-option.is-focused {
        background: ${props => props.background ? props.background : '#111111'};
        color: ${props => props.color ? props.color : '#FFFFFF'};
        height: ${props => props.height ? props.height : '42px;'};
    }

    .Select-menu-outer{
        background: ${props => props.background ? props.background : '#111111'};
        color: ${props => props.color ? props.color : '#FFFFFF'};
        height: ${props => props.height ? props.height : '42px;'};
        font-size: ${props => props.fontSize ? `${props.fontSize}` : '14px'};
        z-index: 10;
        border: 0;
    }
    .Select-noresults{
        background: ${props => props.background ? props.background : '#111111'};
        height: ${props => props.height ? props.height : '42px;'};
        color: ${props => props.color ? props.color : '#FFFFFF'};
    }
`;

const StyledDropzone = styled(Dropzone)`
    display: inline-block;
    input[type="file"]{
        display: inline-block;
    }

`;


export {
    CheckBoxInline,
    DropZoneContainer,
    StyledDropzone,
    FileInput,
    Select,
    Checkbox,
    Text,
    Input,
    Submit,
    TextFormContainer,
    CheckboxFormContainer,
    Textarea,
    SelectPlaceholder,
    SelectFormContainer,
    Placeholder,
    CheckboxInput,
    InputContainer,
    FieldHeader,
    Remark,
    SelectContainer,
    Unit,
    FlexWrapper
};
