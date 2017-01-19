const initialState = { isOn: false, status: 'off', sequence: [], level: 0, step: 0, userInput: [], activeId: null };

export const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_MOVE':
      const currInput = [...state.userInput, action.id];
      if (action.id === state.sequence[state.step]) {
        if (state.level + 1 === currInput.length) {
          return Object.assign({}, state, { status: 'play', level: state.level + 1, step: 0, userInput: [] });
        }
        return Object.assign({}, state, { status: 'listen', step: state.step + 1, userInput: currInput });
      }
      return Object.assign({}, state, { status: 'play', step: 0, userInput: [] });

      return state;

    case 'START':
      if (state.isOn === false || state.status !== 'Go!') {
        return Object.assign({}, initialState, { isOn: true, status: 'Go!', level: 0, sequence: action.sequence });
      }
      return state;

    case 'CHANGE_STYLE':
      return Object.assign({}, state, { activeId: action.id });

    default:
      return state;
  }
}


