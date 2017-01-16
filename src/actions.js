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
  setTimeout(() => {dispatch({
      type: 'CHANGE_STYLE',
      id: null
    });
  }, 500);
};

const playSeq = (sequence, currStep) => {

}