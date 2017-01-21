import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { gameReducer } from './reducer.js';
import { userMove, start, changeMode } from './actions.js';


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

const Counter = ({sequence, currStep}) => {
  return (
    <div>
      <h1>{sequence}</h1>
      <h2>{currStep}</h2>
    </div>
  )
}

// const Field = ({activeId, onCellClick}) => {
//   return (
//     <div className='playfield'>
//       {buttons.map((val, i) => {
//         const className = i === activeId ? 'button active' : 'button';
//         return (
//           <div id={val} key={i} className={className} onClick={() => onCellClick(i)}>{i}</div>
//         )
//       })}
//     </div >
//   )
// };


export class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: '',
      showing: false
    }
  }
  componentDidUpdate(prevProps) {
    if (!this.state.showing && this.props.showSeq !== prevProps.showSeq) {
      this.showSequence();
    }
  }

  showSequence() {
    this.setState({ showing: true });
    const subSeq = this.props.sequence.slice(0, this.props.level + 1);
    console.log(subseq);
    const step = (subSeq) => {
      if (subSeq.length === 0) {
        this.reset(false);
      } else {
        this.show(subSeq[0]);
        setTimeout(() => {
          this.reset(true);
          setTimeout(() => step(subSeq.slice(1)), 300)
        }, 1000)
      }
    };
    step(subSeq);
  }


  show(id) {
    this.setState({ active: id })
  }

  reset(showing) {
    this.setState({ active: '', showing })
  }

  render() {
    return (
      <div className='playfield'>
        {buttons.map((val, i) => {
          const className = i === this.state.active ? 'button active' : 'button';
          return (
            <div id={val} key={i} className={className} onClick={() => this.props.onCellClick(i)}>{i}</div>
          )
        })}
      </div >
    )
  }
};




const StartButton = ({onStartClick}) => {
  return (
    <button onClick={() => onStartClick()}>Start</button>
  )
}

const StrictButton = ({onStrictClick}) => {
  return (
    <button onClick={() => onStrictClick()}>Strict Mode</button>
  )
}

const Status = ({showSeq}) => {
  return (
    <p>{showSeq}</p>
  )
}

const mapStateToProps = (state) => {
  return {
    sequence: state.gameReducer.sequence,
    level: state.gameReducer.level,
    showSeq: state.gameReducer.showSeq,
    strictMode: state.gameReducer.strictMode
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCellClick: (id) => dispatch(userMove(id)),
    onStartClick: () => dispatch(start()),
    onStrictClick: (strictMode) => dispatch(changeMode())
  }
};


const game = ({showSeq, sequence, level, displaying, onCellClick, onStartClick, onStrictClick}) => (
  <div>
    <StartButton onStartClick={onStartClick} />
    <StrictButton onStrictClick={onStrictClick} />
    <Counter sequence={sequence} level={level} />
    <Status showSeq={showSeq} />
    <Field showSeq={showSeq} sequence={sequence} level={level} onCellClick={onCellClick} />
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
