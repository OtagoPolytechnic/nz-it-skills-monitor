import { Provider } from "react-redux";
import Navigation from "./utils/Navigation";
import store from "./utils/store"
import './App.css'

function App() {
  return (
    <>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </>
  )
}

export default App
