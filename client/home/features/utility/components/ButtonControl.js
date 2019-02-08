import styled from 'styled-components';

const Button = styled.button.attrs({
    type: 'submit'
})`
    
    border-radius: 2px;
    text-indent: center;
    color: ${
        props => props.fontColor || '#FFFFFF'
    };
    ${props => (props.height ? `height: ${props.height};` : `height: 40px;`)} 
    ${props => (props.width ? `width: ${props.width};` : `width: 100%;`)}
    ${props =>
        props.border
            ? `border: ${props.border};`
            : `border: 1px solid #FD3A3A;`}
    ${props => (props.margin ? `margin: ${props.margin};` : `margin: 0;`)}
    ${props => (props.disabled ? `background: #DCDCDC; border: 1px solid #DCDCDC;` : `background: #FD3A3A;`)}
    background: ${
        props => !props.disabled && props.background ? props.background : '#FD3A3A'
    };
    ${props => (props.fontSize ? `font-size: ${props.fontSize};` : `font-size: 15px;`)}
    ${props => {
        const { status } = props;
        const colorTone = {
            pending: {
                background: '#28a745',
                backgroundHover: '#218838',
                borderHover: '#1e7e34',
            },
            checking_in: {
                background: '#17a2b8',
                backgroundHover: '#138496',
                borderHover: '#117a8b',
            },
            checked_in: {
                background: '#ffc107',
                backgroundHover: '#e0a800',
                borderHover: '#d39e00',
            },
            underway: {
                background: '#899199',
                backgroundHover: '#899199',
                borderHover: '#899199',
            },
            awaiting_review: {
                background: '#6c757d',
                backgroundHover: '#5a6268',
                borderHover: '#545b62',
            },
            complete: {
                background: '#343a40',
                backgroundHover: '#23272b',
                borderHover: '#1d2124',
            },
        };
        if (status && colorTone[status]) {
            return `
                background: ${colorTone[status].background}; 
                border: ${colorTone[status].background};
                &:hover{
                    background: ${colorTone[status].backgroundHover}; 
                    border: ${colorTone[status].borderHover};
                }
            `;
        }

        // pending: '報名階段',
        // checking_in: '報到階段',
        // checked_in: '等待開始',
        // underway: '比賽進行中',
        // awaiting_review: '等待結算',
        // complete: '比賽完成'
    }}
`;
    
const ReverseButton = styled(Button)`
    background: transparent;
    vertical-align: text-bottom;
    ${props => (props.disabled ? `background: grey; border: 0;` : `background: transparent;`)}
`;

export { Button, ReverseButton };
