import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { gameReducer } from './reducer.js';
import { onCellClick } from './actions.js';


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

const Field = ({activeId, onCellClick}) => {
  return (
    <div className='playfield'>
      {colors.map((val, i) => {
        const className = i === activeId ? 'button active' : 'button';
        return (
          <div id={val} key={i} className={className} onClick={() => onCellClick(i)}>{i}</div>
        )
      })}
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
    status: state.gameReducer.status,
    activeId: state.gameReducer.activeId
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


const game = ({activeId, sequence, currStep, status, onCellClick, onStartClick}) => (
  <div>
    <StartButton onStartClick={onStartClick} />
    <Counter sequence={sequence} currStep={currStep} />
    <Status status={status} />
    <Field activeId={activeId} onCellClick={onCellClick} />
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
