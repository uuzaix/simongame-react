import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { gameReducer } from './reducer.js';
import { onCellClick, onStartClick, onStrictClick } from './actions.js';


const buttons = ['green', 'red', 'yellow', 'blue'];

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
      {buttons.map((val, i) => {
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

const StrictButton = ({strictMode, onStrictClick}) => {
  return (
    <button onClick={() => onStrictClick(strictMode)}>Strict Mode</button>
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
    level: state.gameReducer.level,
    status: state.gameReducer.status,
    activeId: state.gameReducer.activeId,
    strictMode: state.gameReducer.strictMode
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCellClick: (id) => onCellClick(id, dispatch),
    onStartClick: () => onStartClick(dispatch),
    onStrictClick: (strictMode) => onStrictClick(strictMode, dispatch)
  }
};


const game = ({activeId, sequence, level, status, onCellClick, onStartClick, onStrictClick}) => (
  <div>
    <StartButton onStartClick={onStartClick} />
    <StrictButton onStrictClick={onStrictClick} />
    <Counter sequence={sequence} level={level} />
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
