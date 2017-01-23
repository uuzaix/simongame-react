const initialState = { isOn: false, showSeq: false, status: '', strictMode: false, sequence: [], level: 0, step: 0, userInput: [] };

export const game = (state = initialState, action) => {
  switch (action.type) {
    
    case 'USER_MOVE':
      const currInput = [...state.userInput, action.id];
      if (action.id === state.sequence[state.step]) {
        if (state.level + 1 === currInput.length) {
          if (state.level + 1 === state.sequence.length) {
            return Object.assign({}, initialState, { status: 'Win!' });
          }
          return Object.assign({}, state, { showSeq: !state.showSeq, status: '', level: state.level + 1, step: 0, userInput: [] });
        }
        return Object.assign({}, state, { step: state.step + 1, status: '', userInput: currInput });
      }
      if (state.strictMode) {
        return Object.assign({}, initialState, {status: 'Shall we start over?'});
      }
      return Object.assign({}, state, { showSeq: !state.showSeq, status: 'Try one more time', step: 0, userInput: [] });


    case 'START':
      return Object.assign({}, initialState, { isOn: true, showSeq: !state.showSeq, status: '', sequence: action.sequence, strictMode: state.strictMode, });

    case 'CHANGE_MODE':
      return Object.assign({}, state, { strictMode: !state.strictMode });

    default:
      return state;
  }
}
