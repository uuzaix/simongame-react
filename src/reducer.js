const initialState = { isOn: false, showSeq: false, strictMode: false, sequence: [], level: 0, step: 0, userInput: [], activeId: null };

export const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_MOVE':
      const currInput = [...state.userInput, action.id];
      if (action.id === state.sequence[state.step]) {
        if (state.level + 1 === currInput.length) {
          if (state.level + 1 === state.sequence.length) {
            return Object.assign({}, initialState);
          }
          return Object.assign({}, state, { showSeq: true, level: state.level + 1, step: 0, userInput: [] });
        }
        return Object.assign({}, state, { showSeq: false, step: state.step + 1, userInput: currInput });
      }
      if (state.strictMode) {
        return Object.assign({}, initialState);
      }
      return Object.assign({}, state, { showSeq: true, step: 0, userInput: [] });

      return state;

    case 'START':
      if (!state.isOn && !state.showSeq) {
        return Object.assign({}, initialState, { isOn: true, showSeq: true, sequence: action.sequence, strictMode: state.strictMode, });
      }
      return state;

    case 'CHANGE_STYLE':
      return Object.assign({}, state, { activeId: action.id });

    // case 'END_SEQUENCE':
    //   return Object.assign({}, state, { displaying: 'listen' });

    case 'CHANGE_MODE':
      return Object.assign({}, state, { strictMode: !state.strictMode });

    default:
      return state;
  }
}


