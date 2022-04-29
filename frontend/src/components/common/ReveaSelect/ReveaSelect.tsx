import React from 'react';

import classNames from 'classnames';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';

import ErrorMessage from 'components/common/ErrorMessage';

import { ReveaSelectProps } from 'types/common/reveaSelect';

const useInputStyles = makeStyles(() => ({
  root: {
    '& $notchedOutline': {
      borderStyle: 'none',
    },
    '& .MuiOutlinedInput-input': {
      padding: '4px 0',
      color: '#495057',
      backgroundColor: 'white',
      fontFamily: 'Venti CF',
    },
    '& .MuiMenu-paper': {
      maxHeight: '400px',
      height: '400px',
    },
  },
  focused: {},
  notchedOutline: {},
}));

const useSelectStyles = makeStyles(() => ({
  menuPaper: {
    maxHeight: 410,
  },
}));

const useInputLabelStyles = makeStyles(() => ({
  root: {
    color: '#212123',
    fontSize: '16px',
    fontFamily: 'Venti CF',
  },
}));

const useErrorInputLabelStyles = makeStyles(() => ({
  root: {
    color: 'red',
    fontSize: '16px',
    fontFamily: 'Venti CF',
  },
}));

/**
 * Revea Select Common Component.
 *
 * @param {Object} props
 *
 * @returns {React.Component}
 */
const ReveaSelect: React.FC<ReveaSelectProps> = ({ errorMessage, label = '', name, value, options, onChange }) => {
  const inputClasses = useInputStyles();
  const selectClasses = useSelectStyles();
  const inputLabelClasses = useInputLabelStyles();
  const errorLabelClasses = useErrorInputLabelStyles();

  const inputWrapperClass = classNames({
    'revea-input__wrapper': true,
    'input-error': errorMessage ? true : false,
  });

  return (
    <>
      <div className={inputWrapperClass}>
        <InputLabel classes={!errorMessage ? inputLabelClasses : errorLabelClasses}>{label}</InputLabel>
        <Select
          className="revea-input"
          name={name}
          displayEmpty
          value={value}
          onChange={onChange}
          inputProps={{ 'aria-label': name }}
          MenuProps={{ classes: { paper: selectClasses.menuPaper } }}
          input={<Input name={name} classes={inputClasses} />}
        >
          <MenuItem value="" disabled>
            Please Select
          </MenuItem>
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
    </>
  );
};

export default ReveaSelect;
