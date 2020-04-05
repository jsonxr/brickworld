import React, { ReactElement } from 'react';

import meaning from '@app/foo';
import BabylonScene from './BabylonScene';
console.log('meaning: ', meaning);

const App = (): ReactElement => {
  return (
    <div className="App">
      Hello2
      <BabylonScene id="game" />
    </div>
  );
};

export default App;
