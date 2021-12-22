import {useState, version} from 'react';
import './App.css';

import {ColorPicker, Blue} from 'color-picker';

function App() {
  const [color, setColor] = useState(Blue);
  return (
    <div className="Container">
      React {version}
      <h1>Color Picker</h1>
      <p>Color picker with default options</p>
      <ColorPicker color={color} onChange={setColor} />
    </div>
  );
}

export default App;
