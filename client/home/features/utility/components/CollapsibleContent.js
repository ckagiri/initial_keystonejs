// import React, { Component, PropTypes } from 'react';
// import { Collapse, Button, Glyphicon, Image } from 'react-bootstrap';
// import classNames from 'classnames';
// import InlineSVG from 'svg-inline-react';

// import styles from './../styles/collapsibleContent.scss';
// import collapsible_content_arrow from './../images/collapsible_content_arrow.svg';

// export class CollapsibleContent extends Component {
//     constructor(props, context) {
//         super(props, context);
//         this.state = {
//             open: props.defaultExpand
//         }
//         this.mql = window.matchMedia("(min-width: 1025px)");
//         this.onScreenSizeChange = this.onScreenSizeChange.bind(this);
//         this.onClickMenu = this.onClickMenu.bind(this);
//     }

//     onScreenSizeChange(mql) {
//         const { collapsibleOnDesktop, defaultExpand } = this.props;

//         if (mql.matches) {
//             this.setState({
//                 open: defaultExpand || !collapsibleOnDesktop
//             });
//         } else {
//             this.setState({
//                 open: defaultExpand
//             });
//         }
//     }

//     onClickMenu() {
//         this.setState({
//             open: !this.state.open
//         })
//     }

//     componentDidMount() {
//         this.mql.addListener(this.onScreenSizeChange);
//         this.onScreenSizeChange(this.mql);
//     }

//     componentWillReceiveProps(nextProps) {
//         if (nextProps.defaultExpand) {
//             this.setState({
//                 open: true
//             });
//         }
//     }

//     componentWillUnmount() {
//         this.mql.removeListener(this.onScreenSizeChange);
//     }

//     renderArrowSign() {
//         const { arrowType, arrowClassName } = this.props;
//         const { open } = this.state;

//         let arrow = 'div';
//         switch(arrowType) {
//             case 'plus': {
//                 arrow = (
//                     <div className={classNames('collapsible-content-button-bar-plus', { 'expanded': open}, arrowClassName)} />
//                 )
//                 break;
//             }
//             default: {
//                 arrow = (
//                     <div className='collapsible-content-button-bar-arrow'>
//                         <InlineSVG className={classNames({ [styles.arrowRotate]: this.state.open}, arrowClassName)} src={collapsible_content_arrow} />
//                     </div>
//                 )
//                 break;
//             }
//         }
//         return arrow;
//     }

//     render() {
//         const { className = null, title = '', collapsibleOnDesktop, collapseOnClickContent, children } = this.props;
//         let TitleComponent = title;
//         return (
//             <div className={classNames('collapsible-content', { 'not-collapsible-on-d': !collapsibleOnDesktop }, className)}>
//                 <div onClick={this.onClickMenu} className='collapsible-content-button-bar'>
//                     {typeof title === 'string' ? <p className='collapsible-content-button-bar-title'>{title}</p> : <div className='collapsible-content-button-bar-title'>{TitleComponent}</div>}
//                     <div className='collapsible-content-button-bar-arrow-wrapper'>
//                         {this.renderArrowSign()}
//                     </div>
//                 </div>
//                 <Collapse in={this.state.open} className='collapsible-content-detail'>
//                     <div onClick={collapseOnClickContent ? this.onClickMenu : null}>
//                         {children}
//                     </div>
//                 </Collapse>
//             </div>
//         );
//     }
// }

// CollapsibleContent.defaultProps = {
//     defaultExpand: false,
//     collapsibleOnDesktop: true,
//     arrowType: 'default',
//     collapseOnClickContent: false
// };

// CollapsibleContent.propTypes = {
//     defaultExpand: React.PropTypes.bool,
//     collapsibleOnDesktop: React.PropTypes.bool,
//     arrowType: React.PropTypes.string,
//     collapseOnClickContent: React.PropTypes.bool
// };

// export default CollapsibleContent;
