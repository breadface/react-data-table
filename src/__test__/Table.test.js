import React from 'react';
import { renderer } from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import Table from '../Table';

describe('Test Table Component', () => {
  const onChange = jest.fn();
  test('Table renders correctly without props', () => {
    const table = shallow(<Table />)
    expect(table).toMatchSnapshot();
  });

  test('Table renders correctly with props', () => {
    const table = shallow(<Table data={[{name: "Jesmine", role: "Senior fullstack"}]} />)
    expect(toJson(table)).toMatchSnapshot();
  });

  // test('TextArea is enabled by default', () => {
  //   const textarea = shallow(<TextArea />);
  //   expect(textarea.props().disabled).toEqual(false);
  // });
  //
  // test('TextArea is disabled', () => {
  //   const textarea = shallow(<TextArea disabled={true} />);
  //   expect(textarea.props().disabled).toEqual(true);
  // });
});
