import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { gameReducer } from './reducer.js'

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
    <div>
      <div id='red' className='button' onClick={() => onCellClick(1)}>1</div>
      <div id='yellow' className='button' onClick={() => onCellClick(2)}>2</div>
      <div id='green' className='button' onClick={() => onCellClick(3)}>3</div>
      <div id='blue' className='button' onClick={() => onCellClick(4)}>4</div>
    </div>
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
    surrStep: state.gameReducer.surrStep,
    status: state.gameReducer.status
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCellClick: (id) => {
      dispatch({ type: 'USER_MOVE', id: id })
    },
    onStartClick: () => {
      dispatch({ type: 'START' })
    }
  }
};

const game = ({sequence, surrStep, status, onCellClick, onStartClick}) => (
  <div>
    <StartButton onStartClick={onStartClick} />
    <Counter sequence={sequence} surrStep={surrStep} />
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