const initialState = { sequence: [], currentMove: 0, userInput: [] };

export const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_MOVE':
      return Object.assign({}, state, { currentMove: state.currentMove + 1, userInput: [...state.userInput, action.id]});

    default:
      return state;
  }
}