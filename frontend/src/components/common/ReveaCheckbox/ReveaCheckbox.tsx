import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { ReveaCheckboxProps } from 'types/common/reveaCheckbox';

const useStyles = makeStyles(() => ({
  root: {
    background: 'transparent',
  },
}));

const styles: Record<any, any> = createStyles({
  formControlLabel: { fontFamily: 'Venti CF' },
});

/**
 * Revea Checkbox Common Component.
 *
 * @param {Object} props
 *
 * @returns {React.Component}
 */
const ReveaCheckbox: React.FC<ReveaCheckboxProps> = ({ name, label = '', onChange, checked = false }) => {
  const classes = useStyles();

  return (
    <div className="revea-checkbox__wrapper">
      <FormControlLabel
        classes={{ root: classes.root }}
        control={
          <Checkbox
            name={name}
            onChange={onChange}
            className="revea-checkbox"
            classes={{ root: classes.root }}
            checked={checked}
            inputProps={{
              'aria-label': name,
            }}
          ></Checkbox>
        }
        label={typeof label === 'string' ? <span style={styles.formControlLabel}>{label}</span> : label}
      ></FormControlLabel>
    </div>
  );
};

export default ReveaCheckbox;
