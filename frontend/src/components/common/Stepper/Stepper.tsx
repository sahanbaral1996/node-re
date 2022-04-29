import * as React from 'react';
import classNames from 'classnames';

import { Check } from '@material-ui/icons';
import StepLabel from '@material-ui/core/StepLabel';
import { makeStyles } from '@material-ui/core/styles';
import { StepConnector, StepIconProps, styled, withStyles } from '@material-ui/core';

export const useStepperStyles = makeStyles(() => ({
  root: {
    color: '#A4A4A4',
    display: 'flex',
    height: 26,
    alignItems: 'center',
  },
  active: {
    color: '#B91F56',
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: '#49C5B6',
  },
  completed: {
    color: '#ffffff',
    zIndex: 1,
  },
}));

export const StepperConnector = withStyles({
  active: {
    '& $line': {
      borderColor: '#B91F56',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#49C5B6',
    },
  },
  line: {
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

export const StyledStepLabel = styled(StepLabel)({
  '& .MuiStepLabel-label': {
    color: '#212123',
    fontFamily: 'Venti CF, sans-serif',
    fontSize: '16px',
  },
  '& .MuiStepLabel-active': {
    color: '#212123',
    fontWeight: '700',
  },
  '& .MuiStepLabel-completed': {
    color: '#212123',
    fontWeight: '700',
  },
});

export const GetStepIcon = (props: StepIconProps) => {
  const classes = useStepperStyles();
  const { active, completed } = props;

  return (
    <div
      className={classNames(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <div className={classNames(classes.circle, classes.completedCircle)}>
          <Check className={classes.completed} style={{ height: '18px', width: '18px' }} />
        </div>
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
};
