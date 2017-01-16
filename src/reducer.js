const initialState = { isOn: false, status: 'waiting', sequence: [], currStep: 0, userInput: [] };

export const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_MOVE':
      const currInput = [...state.userInput, action.id];
      const newStep = state.currStep + 1;
      if (newStep === state.sequence.length) {
        if (currInput.join('') === state.sequence.join('')) {
          return Object.assign({}, state, { status: 'Win', currStep: newStep, userInput: currInput });
        }
        return Object.assign({}, state, { status: 'Lose', currStep: newStep, userInput: currInput });
      } else if (newStep < state.sequence.length) {
        return Object.assign({}, state, { currStep: newStep, userInput: currInput });
      }
      return state;

    case 'START':
      if (state.isOn === false || state.status !== 'Go!') {
        const newSeq = generateSequence(4);
        return Object.assign({}, initialState, { isOn: true, status: 'Go!', sequence: newSeq });
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