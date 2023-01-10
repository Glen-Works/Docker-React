
export const initialAlertState = { alerts: [] };


export let alertReducer = (state, action) => {
    let newAlerts, element
    switch (action.type) {
        case 'ADD_ALERT':
            newAlerts = [...state.alerts, action.payload]
            return { ...state, alerts: newAlerts }
        case 'REMOVE_ALERT':
            element = state.alerts.filter((e) => e.id !== action.payload.id)
            return { alerts: element }
        default:
            console.log('No valid action: ' + action.type)
            return state
    }
}