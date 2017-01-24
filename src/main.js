import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { game } from './reducer.js';
import { userMove, handleStart, changeMode } from './actions.js';


const buttons = ['green', 'red', 'yellow', 'blue'];

const sounds = [
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
];

const store = createStore(
  combineReducers({ game }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    ReduxThunk,
    createLogger({
      collapsed: true,
      diff: true
    }))
);

const Counter = ({sequence, level}) => {
  const info = level < 0 ? "--" : level + 1
  return (
    <div>
      <h1>{sequence}</h1>
      <h2>{info}</h2>
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
    const step = (subSeq) => {
      if (subSeq.length === 0) {
        this.reset(false);
      } else {
        const head = subSeq[0];
        this.show(head);
        sounds[head].play();
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

  userClick(id) {
    this.show(id);
    sounds[id].play();
    setTimeout(() => {
      this.reset(false);
      setTimeout(() => this.props.onCellClick(id), 1000)
    }, 500)
  }

  render() {
    return (
      <div className='playfield'>
        {buttons.map((val, i) => {
          const className = i === this.state.active ? 'button active' : 'button';
          return (
            <div id={val} key={i} className={className} onClick={() => this.userClick(i)}>{i}</div>
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

const Status = ({status}) => {
  return (
    <h2>{status}</h2>
  )
}

const mapStateToProps = (state) => {
  return {
    sequence: state.game.sequence,
    level: state.game.level,
    showSeq: state.game.showSeq,
    strictMode: state.game.strictMode,
    status: state.game.status
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCellClick: (id) => dispatch(userMove(id)),
    onStartClick: () => dispatch(handleStart()),
    onStrictClick: (strictMode) => dispatch(changeMode())
  }
};


const simon = ({showSeq, sequence, status, level, displaying, onCellClick, onStartClick, onStrictClick}) => (
  <div>
    <StartButton onStartClick={onStartClick} />
    <StrictButton onStrictClick={onStrictClick} />
    <Counter sequence={sequence} level={level} />
    <Status status={status} />
    <Field showSeq={showSeq} sequence={sequence} level={level} onCellClick={onCellClick} />
  </div>
);

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(simon);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
