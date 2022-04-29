import * as React from 'react';
import UserDashboard from './UserDashboard';

import { Switch, Route } from 'react-router-dom';
const DesignRouter = () => {
  return (
    <Switch>
      <Route exact path="/design/userdashboard" component={UserDashboard} />
    </Switch>
  );
};

export default DesignRouter;
