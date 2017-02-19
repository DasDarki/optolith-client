import * as React from 'react';

interface Props {
	current?: number;
	max: number;
}

export default class NumberBox extends React.Component<Props, undefined> {
	render() {
		const { current, max } = this.props;
		return (
			<div className="number-box">
				{ typeof current === 'number' ? <span className="current">{current}</span> : null }
				{ typeof max === 'number' ? <span className="max">{max}</span> : null }
			</div>
		);
	}
}
