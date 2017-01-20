const sounds = [
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
];


const userMove = (id, dispatch) => {
  return (dispatch, getState) => {
    dispatch({ type: 'USER_MOVE', id: id });
    new Promise((resolve) => {
      resolve(playCell(id, dispatch))
    })
      .then(() => {
        const {gameReducer: {sequence, level, status}} = getState();
        if (status === 'play') {
          setTimeout(() => {
            playSeq(sequence, level, dispatch)
          }, 1500)
        }
      }
      )
  }
};

export const onCellClick = (id, dispatch) => {
  dispatch(userMove(id, dispatch));
};

// arr.forEach(id => {(function (i) {setTimeout(() => {console.log(i);}, 1000*i)})(id)});

function playCell(id, dispatch) {
  console.log('iid', id)
  sounds[id].play();
  dispatch({ type: 'CHANGE_STYLE', id: id });
  setTimeout(() => {
    dispatch({
      type: 'CHANGE_STYLE',
      id: null
    });
  }, 500);
}

const playSeq = (sequence, step, dispatch) => {
  sequence.slice(0, step + 1).forEach((val, id) => {
    (function (v, i) {
      setTimeout(() => {
        playCell(v, dispatch)
      }, 2000 * i)
    })(val, id)
  });

}

export const onStartClick = (dispatch) => {
  const sequence = generateSequence(4);
  dispatch({ type: 'START', sequence: sequence });
  playSeq(sequence, 0, dispatch);
}

const generateSequence = (len) => {
  let seq = [];
  while (seq.length < len) {
    seq.push(Math.round(Math.random() * (len - 1)));
  }
  return seq;
}

export const onStrictClick = (strictMode, dispatch) => {
  dispatch({type: 'CHANGE_MODE', mode: !strictMode})
}