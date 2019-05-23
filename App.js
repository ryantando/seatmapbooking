import React, { Component } from "react";
import { createStore } from 'redux'
import SeatMapApp from './src/SeatMapApp'
import { Provider } from 'react-redux'

const initialState = {
    passengerTotal:20,
    layout:  [ [3,2], [4,3], [2,3], [4,4] ],
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_PASSENGER': // Turns out I only use react state
            return { passengerTotal: 30 }
    }
    return state
}

const store = createStore(reducer)

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <SeatMapApp />
            </Provider>
        );
    }
}

export default App