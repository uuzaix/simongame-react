
// const userMove = (id, dispatch) => {
//   return (dispatch, getState) => {
//     dispatch({ type: 'USER_MOVE', id: id });
//     new Promise((resolve) => {
//       resolve(playCell(id, dispatch))
//     })
//       .then(() => {
//         const {gameReducer: {sequence, level, displaying}} = getState();
//         if (displaying === 'play') {
//           setTimeout(() => {
//             playSeq(sequence, level, dispatch)
//           }, 1500)
//         }
//       }
//       )
//   }
// };

// export const onCellClick = (id, dispatch) => {
//   dispatch(userMove(id, dispatch));
// };

// // arr.forEach(id => {(function (i) {setTimeout(() => {console.log(i);}, 1000*i)})(id)});

// function playCell(id, dispatch) {
//   console.log('iid', id)
//   sounds[id].play();
//   dispatch({ type: 'CHANGE_STYLE', id: id });
//   setTimeout(() => {
//     dispatch({
//       type: 'CHANGE_STYLE',
//       id: null
//     });
//   }, 500);
// }

// const playSeq = (sequence, step, dispatch) => {
//   sequence.slice(0, step + 1).forEach((val, id) => {
//     (function (v, i) {
//       setTimeout(() => {
//         playCell(v, dispatch)
//       }, 2000 * i)
//     })(val, id)
//   });

// }

export const start = () => {
  return { type: 'START', sequence: generateSequence(8) };
}

const generateSequence = (len) => {
  let seq = [];
  while (seq.length < len) {
    seq.push(Math.floor(Math.random() * 4));
  }
  return seq;
}

export const changeMode = () => {
  return {type: 'CHANGE_MODE'}
}

export const userMove = (id) => {
  return {
    type: 'USER_MOVE',
    id: id
  }
}