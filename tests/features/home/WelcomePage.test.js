import React from 'react';
import { shallow } from 'enzyme';
import { WelcomePage } from '../../../src/features/home/DefaultPage';

describe('home/WelcomePage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(<WelcomePage {...props} />);

    expect(renderedComponent.find('.home-default-page').length).toBe(1);
  });
});
