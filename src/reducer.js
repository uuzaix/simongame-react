const initialState = { isOn: false, message: '', strictMode: false, showSeq: false, sequence: [], level: -1, step: 0, userInput: [] };

export const game = (state = initialState, action) => {
  switch (action.type) {

    case 'USER_MOVE':
      const currInput = [...state.userInput, action.id];
      if (action.id === state.sequence[state.step]) {
        if (state.level + 1 === currInput.length) {
          if (state.level + 1 === state.sequence.length) {
            return Object.assign({}, initialState, { message: '**', showSeq: !state.showSeq });
          }
          return Object.assign({}, state, { message: '', showSeq: !state.showSeq, level: state.level + 1, step: 0, userInput: [] });
        }
        return Object.assign({}, state, { message: '', step: state.step + 1, userInput: currInput });
      }
      if (state.strictMode) {
        return Object.assign({}, initialState, { message: '!!', strictMode: state.strictMode });
      }
      return Object.assign({}, state, { message: '!!', step: 0, userInput: [] });

    case 'NOTIFY':
      return Object.assign({}, state, { message: '', showSeq: !state.showSeq });


    case 'START':
      return Object.assign({}, initialState, { isOn: true, message: '--', strictMode: state.strictMode, sequence: action.sequence, level: 0 });

    case 'CHANGE_MODE':
      return Object.assign({}, state, { strictMode: !state.strictMode });

    default:
      return state;
  }
}
