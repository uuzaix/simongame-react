import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { gameReducer } from './reducer.js';
import {onCellClick} from './actions.js';


const colors = ['green', 'red', 'yellow', 'blue'];

const store = createStore(
  combineReducers({ gameReducer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    ReduxThunk,
    createLogger({
      collapsed: true,
      diff: true
    }))
);

const Counter = ({sequence, surrStep}) => {
  return (
    <div>
      <h1>{sequence}</h1>
      <h2>{surrStep}</h2>
    </div>
  )
}

const Field = ({onCellClick}) => {
  return (
    <div className='playfield'>
      {colors.map((val, i) => (
        <div id={val} key={i} className='button' onClick={() => onCellClick(i + 1)}>{i + 1}</div>
      ))}
    </div >
  )
};

const StartButton = ({onStartClick}) => {
  return (
    <button onClick={() => onStartClick()}>Start</button>
  )
}

const Status = ({status}) => {
  return (
    <p>{status}</p>
  )
}

const mapStateToProps = (state) => {
  return {
    sequence: state.gameReducer.sequence,
    currStep: state.gameReducer.currStep,
    status: state.gameReducer.status
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCellClick: (id) => onCellClick(id, dispatch),
    onStartClick: () => {
      dispatch({ type: 'START' })
    }
  }
};


const game = ({sequence, currStep, status, onCellClick, onStartClick}) => (
  <div>
    <StartButton onStartClick={onStartClick} />
    <Counter sequence={sequence} currStep={currStep} />
    <Status status={status} />
    <Field onCellClick={onCellClick} />
  </div>
);

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(game);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
