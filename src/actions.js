const sounds = [
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
];

export const onCellClick = (id, dispatch) => {
  sounds[id].play();
  dispatch({ type: 'USER_MOVE', id: id });
  dispatch({ type: 'CHANGE_STYLE', id: id });
  setTimeout(() => {
    dispatch({
      type: 'CHANGE_STYLE',
      id: null
    });
  }, 500);
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

const playSeq = (sequence, dispatch) => {
  sequence.forEach((val, id) => {
    (function (v, i) {
      setTimeout(() => {
        playCell(v, dispatch)
      }, 2000 * i)
    })(val, id)
  })
}


export const onStartClick = (sequence, dispatch) => {
  dispatch({ type: 'START' });
  playSeq(sequence, dispatch);
}