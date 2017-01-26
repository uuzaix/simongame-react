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

const Counter = ({status, sequence, level}) => {
  const info = status === '' ? level + 1 : status
  return (
    <div>
      <h1>{info}</h1>
    </div>
  )
}

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
    setTimeout(() => step(subSeq), 1000)

  }


  show(id) {
    this.setState({ active: id })
  }

  reset(showing) {
    this.setState({ active: '', showing })
  }

  userClick(id) {
    if (this.state.showing || !this.props.isOn) {
      return
    }
    this.show(id);
    sounds[id].play();
    setTimeout(() => {
      this.reset(false);
      this.props.onCellClick(id)
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


const Controls = ({strictMode, onStrictClick, onStartClick}) => {
  const strictStatus = strictMode ? 'strictStatus on' : 'strictStatus'
  return (
    <div className='controls'>
      <button onClick={() => onStartClick()}>Start</button>
      <div className='strictDiv'>
        <div className={strictStatus}></div>
        <button className='strictButton' onClick={() => onStrictClick()}></button>
        <p className='strictName'>Strict mode</p>
      </div>
    </div>
  )
}

const Status = ({status}) => {
  return (
    <h2>{status}</h2>
  )
}

const mapStateToProps = (state) => {
  return {
    isOn: state.game.isOn,
    status: state.game.status,
    strictMode: state.game.strictMode,
    showSeq: state.game.showSeq,
    sequence: state.game.sequence,
    level: state.game.level
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCellClick: (id) => dispatch(userMove(id)),
    onStartClick: () => dispatch(handleStart()),
    onStrictClick: () => dispatch(changeMode())
  }
};


const simon = ({isOn, showSeq, sequence, status, strictMode, level, displaying, onCellClick, onStartClick, onStrictClick}) => (
  <div>
    <Controls strictMode={strictMode} onStrictClick={onStrictClick} onStartClick={onStartClick} />
    <Counter status={status} sequence={sequence} level={level} />
    <Status status={status} />
    <Field isOn={isOn} showSeq={showSeq} sequence={sequence} level={level} onCellClick={onCellClick} />
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
