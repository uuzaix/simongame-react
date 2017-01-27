

const start = () => {
  return { type: 'START', sequence: generateSequence(8) };
}

export const handleStart = () => {
  return (dispatch) => {
    setTimeout(() => dispatch(start()), 800)
  }
}

const generateSequence = (len) => {
  let seq = [];
  while (seq.length < len) {
    seq.push(Math.floor(Math.random() * 4));
  }
  return seq;
}

export const changeMode = () => {
  return { type: 'CHANGE_MODE' }
}

export const userMove = (id) => {
  return {
    type: 'USER_MOVE',
    id: id
  }
}

export const endOfError = () => {
  return { type: 'END_OF_ERROR' }
}