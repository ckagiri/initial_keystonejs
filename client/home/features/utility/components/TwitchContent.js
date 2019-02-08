import styled from 'styled-components';

const TwitchContent = styled.p`
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 16px;
`;

const TwitchConnected = styled.b`
    font-weight: none;
    font-size: 16px;
    color: green;
`

const TwitchUnconnect = styled.b`
    font-weight: none;
    font-size: 16px;
    color: red;
`

export { TwitchContent, TwitchConnected, TwitchUnconnect };
