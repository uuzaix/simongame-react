import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { game } from './reducer.js';
import { userMove, handleStart, changeMode, endOfError } from './actions.js';


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

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.status !== '' && prevProps.status === '') {
      this.blink(this.props.onError);
    }
  }
  blink(f) {
    setTimeout(() => {
      this.setState({ visible: false });
      setTimeout(() => {
        this.setState({ visible: true });
        f()
      }, 1000)
    }, 1000)
  }

  render() {
    const info = this.props.status === '' ? this.props.level + 1 : this.props.status;
    return (
      <div className='group'>
        <div style={{ visibility: this.state.visible ? 'visible' : 'hidden' }}>{info}</div>
        <div className='label'>COUNT</div>
      </div>
    )
  }
}

const StartButton = ({ onStartClick}) => {
  return (
    <div className='group'>
      <button className='button' onClick={() => onStartClick()}></button>
      <div className='label'>START</div>
    </div>
  )
}
const StrictButton = ({ strictMode, onStrictClick}) => {
  const strictStatus = strictMode ? 'strictStatus on' : 'strictStatus'
  return (
    <div className='strictDiv group'>
      <div className={strictStatus}></div>
      <button className='button yellow' onClick={() => onStrictClick()}></button>
      <div className='label'>STRICT</div>
    </div>
  )
}

const Controls = ({status, strictMode, level, onStartClick, onStrictClick, onError}) => (
  <div className='controls'>
    <Counter status={status} level={level} onError={onError} />
    <StartButton strictMode={strictMode} onStartClick={onStartClick} onStrictClick={onStrictClick} />
    <StrictButton strictMode={strictMode} onStartClick={onStartClick} onStrictClick={onStrictClick} />
  </div>
)

class Field extends React.Component {
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
          const className = i === this.state.active ? 'cell active' : 'cell';
          return (
            <div id={val} key={i} className={className} onClick={() => this.userClick(i)}></div>
          )
        })}
      </div >
    )
  }
};


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
    onStrictClick: () => dispatch(changeMode()),
    onError: () => dispatch(endOfError())
  }
};


const simon = ({isOn, showSeq, sequence, status, strictMode, level, onCellClick, onStartClick, onStrictClick, onError}) => (
  <div className={'flexContainer'}>
    <Field isOn={isOn} showSeq={showSeq} sequence={sequence} level={level} onCellClick={onCellClick} />
    <Controls status={status} level={level} strictMode={strictMode} onStartClick={onStartClick} onStrictClick={onStrictClick} onError={onError} />
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
