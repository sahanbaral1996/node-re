import Plan from 'components/home/Plan/Plan';
import * as React from 'react';
import PersonalizedSolution from './PersonalizedSolution';

const Home: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <PersonalizedSolution />
      <Plan />
    </React.Fragment>
  );
};

export default Home;
