const initialState = { isOn: false, status: '', strictMode: false, showSeq: false, sequence: [], level: -1, step: 0, userInput: [] };

export const game = (state = initialState, action) => {
  switch (action.type) {

    case 'USER_MOVE':
      const currInput = [...state.userInput, action.id];
      if (action.id === state.sequence[state.step]) {
        if (state.level + 1 === currInput.length) {
          if (state.level + 1 === state.sequence.length) {
            return Object.assign({}, initialState, { status: '!!' });
          }
          return Object.assign({}, state, { status: '', showSeq: !state.showSeq, level: state.level + 1, step: 0, userInput: [] });
        }
        return Object.assign({}, state, { status: '', step: state.step + 1, userInput: currInput });
      }
      if (state.strictMode) {
        return Object.assign({}, initialState, { status: '!!', strictMode: state.strictMode });
      }
      return Object.assign({}, state, { status: '!!', showSeq: !state.showSeq, step: 0, userInput: [] });


    case 'START':
      return Object.assign({}, initialState, { isOn: true, strictMode: state.strictMode, showSeq: !state.showSeq, sequence: action.sequence, level: 0 });

    case 'CHANGE_MODE':
      return Object.assign({}, state, { strictMode: !state.strictMode });

    default:
      return state;
  }
}
