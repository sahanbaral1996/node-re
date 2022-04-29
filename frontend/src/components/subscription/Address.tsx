import * as React from 'react';

import { IAddressFormValuesProps } from 'types/subscription';

import ReveaSelect from 'components/common/ReveaSelect';
import ReveaInput from 'components/common/ReveaInput';

import { en } from 'constants/lang';

const { LINE_ONE, LINE_TWO, STATE, CITY, ZIP } = en.subscription.FORM.ADDRESS;

const getName = (name: string, prefix?: string) => {
  if (!prefix) {
    return name;
  }

  return `${prefix}.${name}`;
};

const Address: React.FC<IAddressFormValuesProps> = ({
  values,
  handleChange,
  prefix,
  stateOptions,
  touched = {},
  errors = {},
}) => {
  return (
    <>
      <div className="row">
        <div className="col-12-md mb-4x">
          <ReveaInput
            label={LINE_ONE.LABEL}
            value={values.lineOne}
            onChange={handleChange}
            name={getName('lineOne', prefix)}
            placeholder={LINE_ONE.PLACEHOLDER}
            errorMessage={touched.lineOne && errors.lineOne ? errors.lineOne : ''}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12-md mb-4x">
          <ReveaInput
            label={LINE_TWO.LABEL}
            value={values.lineTwo}
            onChange={handleChange}
            name={getName('lineTwo', prefix)}
            placeholder={LINE_TWO.PLACEHOLDER}
            errorMessage={touched.lineTwo && errors.lineTwo ? errors.lineTwo : ''}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12-md mb-4x">
          <ReveaInput
            label={CITY.LABEL}
            value={values.city}
            onChange={handleChange}
            name={getName('city', prefix)}
            placeholder={CITY.PLACEHOLDER}
            errorMessage={touched.city && errors.city ? errors.city : ''}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-6-md mb-4x">
          <ReveaSelect
            options={stateOptions}
            value={values.state}
            onChange={handleChange}
            name={getName('state', prefix)}
            label={STATE.LABEL}
            errorMessage={touched.state && errors.state ? errors.state : ''}
          />
        </div>
        <div className="col-6-md mb-4x">
          <ReveaInput
            label={ZIP.LABEL}
            value={values.zip}
            onChange={handleChange}
            name={getName('zip', prefix)}
            placeholder={ZIP.PLACEHOLDER}
            errorMessage={touched.zip && errors.zip ? errors.zip : ''}
          />
        </div>
      </div>
    </>
  );
};

export default Address;
