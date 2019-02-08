import React from 'react';
import { Field } from 'redux-form';
import { Image } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import {
    DropZoneContainer,
    Select,
    Checkbox,
    Input,
    TextFormContainer,
    CheckboxFormContainer,
    Textarea,
    SelectPlaceholder,
    Placeholder,
    InputContainer,
    FieldHeader,
    Remark,
    SelectContainer,
    Unit,
    FlexWrapper
} from './FormStyle';

class FormInput extends React.PureComponent{
    constructor(props){
        super(props);
        const {input: {value}} = this.props;
        this.state={
            showPlaceholder: !value,
        }
    }

    /*
    ** Show placholder when clear the form
    ** Terry Chan
    ** 16/08/2018
    */
    componentWillReceiveProps({ input }) {
        const {
            input: currentInput,
        } = this.props;

        const valueReseted = currentInput.value !== input.value && !input.value;
        // if submit chat message failed
        if (valueReseted) {
            this.setState({
                showPlaceholder: true,
            })
        } 
    }

    onInputFocus = (e) => {
        const {input} = this.props;
        input.onFocus(e);
        this.setState({
            showPlaceholder: false,
        })
    }

    onInputBlur = (e) => {
        const {input} = this.props;
        input.onBlur(e);
        if(!input.value){
            this.setState({
                showPlaceholder: true,
            })
        }
    }

    render(){
        const { initial, input, meta, type, className, 'data-label': dataLabel, placeholder, children = null, mandatory = false, ...props} = this.props;
        var { showPlaceholder } = this.state;
        showPlaceholder = (initial || showPlaceholder) && !input.value;
        switch (type) {
            case 'text':
            case 'password':
                return (
                    <TextFormContainer
                        display={props.display}
                        width={props.width}
                        margin_right={props.margin_right}
                        margin={props.margin}
                    >
                    {!!props.text && <FieldHeader headerFontSize={props.headerFontSize}>{props.text}{!!props.remark && <Remark>*</Remark>}</FieldHeader>}
                        <FlexWrapper
                            display='flex'
                            flex_direction='row'
                        >
                            <InputContainer>

                                <Input
                                    type={type}
                                    {...props}
                                    {...input}
                                    error={meta.error}
                                    onFocus={this.onInputFocus}
                                    onBlur={this.onInputBlur}
                                    height={props.height}
                                />
                                <Placeholder show={showPlaceholder} text={!!props.text} fontSize={props.fontSize}>
                                    {placeholder}
                                </Placeholder>

                            </InputContainer>
                            {!!props.unit && <Unit unit_color={props.unit_color}><p>{props.unit}</p></Unit>}
                        </FlexWrapper>
                    </TextFormContainer>
                );
            case 'textarea': {
                return (
                    <TextFormContainer margin={props.margin}>
                        {!!props.text && <FieldHeader headerFontSize={props.headerFontSize}>{props.text}</FieldHeader>}
                        <Textarea
                            {...input}
                            {...props}
                            onFocus={this.onInputFocus}
                            onBlur={this.onInputBlur}
                            height={props.height}
                            fontSize={props.fontSize}
                        />
                        <Placeholder show={showPlaceholder} fontSize={props.fontSize}>
                            {placeholder}
                        </Placeholder>
                    </TextFormContainer>
                );
            }
            case 'checkbox': {
                return (
                    <CheckboxFormContainer>
                        <input type={type} {...input} />
                        <div>
                            <Checkbox value="on">
                                <Image responsive src="/images/tick.svg" />
                            </Checkbox>
                            <span>
                                {dataLabel}
                            </span>
                        </div>
                    </CheckboxFormContainer>
                );
            }
            case 'select': {
                const { onChange, width, background, display, ...rest } = props;
                return (
                    <SelectContainer width={width} display={display} margin_right={props.margin_right} margin={props.margin}>
                        {!!props.text && <FieldHeader headerFontSize={props.headerFontSize}>{props.text}{!!props.remark && <Remark>*</Remark>}</FieldHeader>}
                        <Select
                            {...rest}
                            placeholder={
                                <SelectPlaceholder show={!input.value} fontSize={props.fontSize}>
                                    <span>
                                        {placeholder}
                                    </span>
                                </SelectPlaceholder>
                            }
                            value={input.value}
                            onChange={key => {
                                input.onChange(key);
                                if (typeof onChange === 'function') {
                                    onChange(key);
                                }
                            }}
                            onBlur={() => input.onBlur(input.value)}
                            searchable={false}
                            width='100%'
                            background={background}
                            margin_right={props.margin_right}
                            error={meta.error}
                        />
                    </SelectContainer>
                );
            }
            case 'dropzone': {
                const {
                    defaultImageSrc = '/images/icon/add_photo_icon.png',
                    ...rest
                } = props;
                const { name, value, ...inputRest } = input;
                let file = null;
                let invalidFile = false;
                if (value.error) {
                    invalidFile = true;
                } else if (
                    value &&
                    typeof value === 'object' &&
                    value.file instanceof File
                ) {
                    file = value[name];
                }
                return (
                    <DropZoneContainer>
                        <Dropzone
                            className="dropzone"
                            multiple={false}
                            accept="image/jpeg,image/jpg,image/png"
                            name={name}
                            onDropAccepted={(filesToUpload, e) => {
                                console.log(filesToUpload, input, name);
                                input.onChange({
                                    [name]: filesToUpload
                                });
                            }}
                            onDropRejected={e => {
                                // console.log('rejected', e);
                                // console.log(input);
                                input.onChange({
                                    error: true
                                });
                            }}
                            {...inputRest}
                        />
                        {children}
                    </DropZoneContainer>
                );
            }
            default: {
                return null;
            }
        }
    }
}

const renderField = props => <FormInput {...props} />;

export const FormField = props => <Field component={renderField} {...props} />;
