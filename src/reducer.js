const initialState = { isOn: false, status: 'waiting', sequence: [], surrStep: 0, userInput: [] };

export const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_MOVE':
      const currInput = [...state.userInput, action.id];
      if (state.surrStep + 1 === state.sequence.length) {
        if (currInput.join('') === state.sequence.join('')) {
          return Object.assign({}, state, { status: 'Win', surrStep: state.surrStep + 1, userInput: currInput });
        }
        return Object.assign({}, state, { status: 'Lose', surrStep: state.surrStep + 1, userInput: currInput });
      }
      return Object.assign({}, state, { surrStep: state.surrStep + 1, userInput: currInput });

    case 'START':
      if (state.isOn === false) {
        const newSeq = generateSequence(4);
        return Object.assign({}, state, { isOn: true, status: 'Go!', sequence: newSeq });
      }
      return state;

    default:
      return state;
  }
}


const generateSequence = (len) => {
  let seq = [];
  while (seq.length < len) {
    seq.push(Math.round(Math.random() * 3) + 1)
  }
  return seq;
}