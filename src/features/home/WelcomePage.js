import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from './redux/actions';

export class WelcomePage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="home-welcome-page">
        <header className="app-header">
          <img src={require('../../images/rekit-react.png')} className="rekit-logo" alt="logo" />
          <h1 className="app-title">Welcome to Rekit React</h1>
        </header>
        <div className="app-intro">
          <h3>To get started:</h3>
          <ul>
            <li>
              Edit component{' '}
              <code>
                src/features/home/DefaultPage.js
              </code>{' '}
              for this page.
            </li>
            <li>
              Edit component{' '}
              <code>
                src/features/home/App.js
              </code>{' '}
              for the root container layout.
            </li>
            <li>
              To see examples, access:&nbsp;
              <Link to="/examples">/examples</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
