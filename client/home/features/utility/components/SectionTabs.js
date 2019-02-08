// import React, { Component } from 'react';
// import { Tabs, Tab, Nav, NavItem } from 'react-bootstrap';
// import classNames from 'classnames';

// import { CollapsibleContent } from 'utility';
// import styles from './../styles/sectionTabs.scss';

// export class SectionTabs extends Component {
// 	constructor(props, context) {
// 		super(props, context);
// 		this.state = {
// 			activeKey: props.defaultActiveKey ? props.defaultActiveKey : 1
// 		}
// 		this.onSelect = this.onSelect.bind(this);
// 	}

// 	onSelect(selectedKey) {
// 		this.setState({
// 			activeKey: selectedKey
// 		});

// 		const { onSelect } = this.props;
// 		if (typeof onSelect === 'function') {
// 			onSelect(selectedKey);
// 		}
// 	}

// 	render() {
// 		const { className = null, children, ...props } = this.props;
// 		let { activeKey } = this.state;

// 		activeKey = props.activeKey ? props.activeKey : activeKey;

// 		let childrenArray = React.Children.toArray(children);
// 		let activeChild = childrenArray.find((child) => (activeKey === child.props.eventKey));

// 		return (
// 			<Tab.Container defaultActiveKey={1} activeKey={activeKey} className={classNames('section-tabs', className)} {...props} onSelect={this.onSelect}>
// 				<div>
// 					<Nav bsStyle='tabs'>
// 						{React.Children.map(children, (child) => (
// 							<NavItem key={child.props.eventKey} eventKey={child.props.eventKey}>
// 								{child.props.title}
// 							</NavItem>
// 						))}
// 					</Nav>
// 					<CollapsibleContent className='section-tabs-collapsible' title={activeChild ? activeChild.props.title : ''}>
// 						<Nav>
// 							{childrenArray.filter((child) => (activeKey !== child.props.eventKey)).map((child) => (
// 								<NavItem key={child.props.eventKey} eventKey={child.props.eventKey}>
// 									{child.props.title}
// 								</NavItem>
// 							))}
// 						</Nav>
// 					</CollapsibleContent>
// 					<Tab.Content animation>
// 						{children}
// 					</Tab.Content>
// 				</div>
// 			</Tab.Container>
// 		);
// 	}
// };

// export default SectionTabs;
