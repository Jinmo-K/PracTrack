import React from 'react';
import renderer from 'react-test-renderer';
import ProgressBar from './ProgressBar';

describe('<ProgressBar />', () => {
  it('should render correctly when goal has been achieved and text is shown', () => {
    const tree = renderer
      .create(<ProgressBar current={100} goal={10} showText={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when goal has not been achieved and text is shown', () => {
    const tree = renderer
      .create(<ProgressBar current={1} goal={10} showText={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when current progress is 0 and text is shown', () => {
    const tree = renderer
      .create(<ProgressBar current={0} goal={10} showText={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when goal has been achieved and text is hidden', () => {
    const tree = renderer
      .create(<ProgressBar current={100} goal={10} showText={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when goal has not been achieved and text is hidden', () => {
    const tree = renderer
      .create(<ProgressBar current={1} goal={10} showText={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly when current progress is 0 and text is hidden', () => {
    const tree = renderer
      .create(<ProgressBar current={0} goal={10} showText={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
})
