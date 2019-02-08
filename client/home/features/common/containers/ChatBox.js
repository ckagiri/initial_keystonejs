/*
** [Component]
** ChatBox Container with popup
** @Terry Chan@15/08/2018
**
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { ClipLoader } from 'react-spinners';
// Components
import ChatMessager from 'common/components/ChatMessager';
import MediaQuery from 'common/components/MediaQuery';
// import { Modal } from 'react-bootstrap';
// Actions
import { changeChatboxVisible, changeChatboxContent } from 'member/reducers/chatMessage';
// KeyFrames
const phoneSlideOutAnimation = keyframes`
    from {
        right: 0%;
    }
    to {
        right: -100%;
    }
`
const phoneSlideInAnimation = keyframes`
    from {
        right: -100%;
    }
    to {
        right: 0%;
    }
`
const slideInAnimation = keyframes`
    from {
        right: -420px;
    }
    to {
        right: 20px;
    }
`
const slideOutAnimation = keyframes`
    from {
        right: 20px;
    }
    to {
        right: -420px;
    }
`
const fadeOutAnimation = keyframes`
    to { 
        opacity: 0;
    }
`
const fadeInAnimation = keyframes`
    to { 
        opacity: 1;
    }
`

// Containers & Wrappers
const MessagerWrapper = styled.div`
    position: relative;
    text-align: center;
`;

const ChatContainer = styled.div`
    margin: 0 auto;
    padding: 20px;
`;

const MessagerContainer = styled.div`
    background-color: #202020;
    width: 400px;
    min-height: 500px;
    max-height: 700px;
    bottom: 40px;
    border-radius: 9px;
    position: fixed;
    box-shadow: 0 5px 15px rgba(0,0,0,.5);
    // border: 1px solid #3a3a3a;
    right: -420px;
    z-index: 999;
    animation: ${
        props => {
            if (props.isInitial) return null;
            const { active } = props;
            var type = slideOutAnimation;
            const setting = '0.3s forwards';
            if (active) {
                type = slideInAnimation;
            }
            return `${type} ${setting}`;
        }
    };
    ${
        MediaQuery.phone`
            width: 100%;
            right: -100%;
            bottom: 0;
            animation: ${
                props => {
                    if (props.isInitial) return null;
                    const { active } = props;
                    var type = phoneSlideOutAnimation;
                    const setting = '0.3s forwards';
                    if (active) {
                        type = phoneSlideInAnimation;
                    }
                    return `${type} ${setting}`;
                }
            };

        `
    };
    ${MessagerWrapper} {
        h2{
            font-size: 18px;
            margin: 0;
            text-align: left;
            padding: 15px 20px;
            background: #001939;
            color: white;
            border-top-left-radius: 9px;
            border-top-right-radius: 9px;
        }
    }
`;

// Elements
const Backdrop = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 998;
    top: 0;
    left: 0;
    ${
        MediaQuery.phone`
            background: black;
            opacity: 0.5;
        `
    };
`; 

const Submitting = styled.div`
    width: 45px;
    height: 45px;
`;

const IconButton = styled.div`
    animation: ${
        props => {
            const { active } = props;
            var type = fadeOutAnimation;
            const setting = '0.5s forwards';
            if (active) {
                type = fadeInAnimation;
            }
            return `${type} ${setting}`;
        }
    };
    background-image: url(/images/chatbox/message-64X64.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-color: white;
    background-position: center 2px;
    position: fixed;
    z-index: 999;
    bottom: 40px;
    box-shadow: 2px 2px 5px #3a3a3a;
    opacity: 0.3;
    right: 40px;
    width: 45px;
    height: 45px;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    transition: all 1s ease-in-out;
    &:hover {
        opacity: 1;
        transform: translateX(-10px);
    }
`;

const CloserButton = styled.div`
    display: block;
    position: absolute;
    right: 20px;
    top: 14px;
    width: 20px;
    background: url(/images/icon/close.png) no-repeat center center;
    cursor: pointer;
    height: 20px;
`;

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // showModal: props.showModal,
            initial: true,
        };
        // all of internal events
        [
            'changeModalStatus',
            'onScrollDocument',
            'onEscape',
            'onCloseDown',
        ].forEach((key) => {
            this[key]= this[key].bind(this);
        });
    }

    componentWillReceiveProps({ chatTitle }) {
        const {
            chatTitle: currentChatTitle,
        } = this.props;

        const autoSetChatTitle = chatTitle !== currentChatTitle && !!chatTitle;
        // if the auto replacment of chat message title is added, then clear the form and replce from new title
        if (autoSetChatTitle) {
            this.setState({
                autoClearForm: true,
            })
        } 
    }

    componentDidMount() {
        document.addEventListener('scroll', this.onScrollDocument);
        document.addEventListener('keydown', this.onEscape);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.onScrollDocument);
        document.removeEventListener('keydown', this.onEscape);
    }

    changeModalStatus() {
        var newVisible = !this.props.showModal;
        // handle first time popover
        if (this.state.initial && newVisible) {
            this.setState({
                initial: false,
            });
        }
        this.props.changeChatboxVisible(newVisible);
        if (!newVisible) {
            // reset store chatbox title
            this.props.changeChatboxContent({
                title: null,
            });
        }
    }

    onEscape(e) {
        if (this.props.showModal) {
            const evt = e || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key == "Escape" || evt.key == "Esc");
            } else {
                isEscape = (evt.keyCode == 27);
            }
            if (isEscape) {
                this.onScrollDocument();
            }
        }
    }

    onScrollDocument() {
        // hide it when scroll the screen
        if (this.props.showModal) {
            this.props.changeChatboxVisible();
        }
    }

    /*
    ** Special for close icon to clear the form
    */
    onCloseDown() {
        const self = this;
        const setState = (status) => {
            self.setState({
                autoClearForm: status,
            });
        }
        setState(true);
        // reset after clear status 1 second
        setTimeout(() => {
            setState(false);
        }, 1000);
        self.changeModalStatus();
    }

    render() {
        // denied non-member
        if (!this.props.isLogined) {
            return null;
        }
        // const { showModal } = this.state;
        const { isSubmiting, showModal, chatTitle, replyMessageId } = this.props;
        return (
            <div>
                {
                    showModal ? <Backdrop onClick={this.changeModalStatus} /> : null
                }
                <IconButton active={!showModal} onClick={this.changeModalStatus}>
                    <Submitting>
                        <ClipLoader color="#e2e2e2" sizeUnit="px" size={45} loading={isSubmiting} />
                    </Submitting>
                </IconButton>
                <MessagerContainer active={showModal} isInitial={this.state.initial && !chatTitle}>
                    <MessagerWrapper>
                        <h2>
                            {
                                replyMessageId ? 
                                '回覆訊息給我們' :
                                '發訊息給我們'
                            }
                        </h2>
                        <CloserButton onClick={this.onCloseDown} />
                        <ChatContainer>
                            <ChatMessager
                                autoClear={this.state.autoClearForm}
                                chatTitle={chatTitle}
                                replyMessageId={replyMessageId}
                                onClose={this.changeModalStatus}
                                onSubmit={this.submitChat}
                                isSubmiting={isSubmiting}
                                isFailSubmit={this.props.isFailSubmit}
                            />
                        </ChatContainer>
                    </MessagerWrapper>
                </MessagerContainer>
            </div>
        );
    }
};

const mapStateToProps = ({
    member: {
        auth: { memberId, access_token },
        chatMessage : { chatFetching, chatSuccess, visible: showModal, chatTitle, replyMessageId }, 
    },
}) => ({
    isLogined: memberId !== '' && access_token !== '',
    isSubmiting: chatFetching,
    isFailSubmit: !chatSuccess,
    chatTitle,
    showModal,
    replyMessageId,
});

const mapDispatchToProps = {
    changeChatboxVisible,
    changeChatboxContent,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);

