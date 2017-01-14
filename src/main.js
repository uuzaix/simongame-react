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

const Counter = ({currentMove}) => {
  return (
    <h1>{currentMove}</h1>
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

const mapStateToProps = (state) => {
  return {
    currentMove: state.gameReducer.currentMove
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCellClick: (id) => {
      dispatch({ type: 'USER_MOVE', id: id })
    }
  }
};

const game = ({currentMove, onCellClick}) => (
  <div>
    <Counter currentMove={currentMove} />
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