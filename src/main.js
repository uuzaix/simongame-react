import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { game } from './reducer.js';
import { userMove, handleStart, changeMode, notify } from './actions.js';


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
    if (this.props.message !== '' && prevProps.message === '' || (this.props.message === '--' && prevProps.message === '**')) {
      if (this.props.message === '**') {
        this.blinkTwice()
      } else {
        this.blinkTwice()
        setTimeout(() => {
          this.props.notify()
        }, 1500)
      }
    }
  }

  blink() {
    setTimeout(() => {
      this.setState({ visible: false });
      setTimeout(() => {
        this.setState({ visible: true });
      }, 300)
    }, 300)
  }

  blinkTwice() {
    this.blink();
    setTimeout(() => {
      this.blink();
    }, 900)
  }

  render() {
    const info = (this.props.message === '' && this.props.level !== -1) ? this.props.level + 1 : this.props.message;
    return (
      <div className='group'>
        <div className='counterDiv'>
          <p className='counter' style={{ visibility: this.state.visible ? 'visible' : 'hidden' }}>{info}</p>
        </div>
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

const Controls = ({message, strictMode, level, onStartClick, onStrictClick, notify}) => (
  <div className='controls'>
    <Counter message={message} level={level} notify={notify} />
    <StartButton strictMode={strictMode} onStartClick={onStartClick} onStrictClick={onStrictClick} />
    <StrictButton strictMode={strictMode} onStartClick={onStartClick} onStrictClick={onStrictClick} />
    <h1 className='gameName'>simon</h1>
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
      if (this.props.message === '**') {
        const winSeq = Array(3).fill(prevProps.sequence[prevProps.level]);
        this.showSequence(winSeq, 500);
      } else if (this.props.message === '' && this.props.isOn) {
        this.showSequence(this.props.sequence.slice(0, this.props.level + 1), 1000);
      }
    }
    if (!this.props.isOn && this.props.message === '' && prevProps.message === '!!') {
      this.props.onStartClick();
    }
  }

  showSequence(seq, delay) {
    this.setState({ showing: true });
    const step = (seq) => {
      if (seq.length === 0) {
        this.reset(false);
      } else {
        const head = seq[0];
        this.show(head);
        sounds[head].play();
        setTimeout(() => {
          this.reset(true);
          setTimeout(() => step(seq.slice(1)), delay / 3)
        }, delay)
      }
    };
    setTimeout(() => step(seq), delay)
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
    message: state.game.message,
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
    notify: () => dispatch(notify())
  }
};


const simon = ({isOn, showSeq, sequence, message, strictMode, level, onCellClick, onStartClick, onStrictClick, notify}) => (
  <div className={'flexContainer'}>
    <Field isOn={isOn} message={message} showSeq={showSeq} sequence={sequence} level={level} onCellClick={onCellClick} onStartClick={onStartClick} />
    <Controls message={message} level={level} strictMode={strictMode} onStartClick={onStartClick} onStrictClick={onStrictClick} notify={notify} />
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
