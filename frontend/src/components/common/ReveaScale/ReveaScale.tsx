import * as React from 'react';
import classnames from 'classnames';

interface ReveaScaleProps {
  scale: number;
  minLabel: string;
  maxLabel: string;
  midLabel?: string;
  currentValue?: string | number;
  handleChange: (value: number) => void;
  hideValueLabels?: boolean;
  showAllLabels?: boolean;
}

const MIN_VALUE = 1;

/**
 *
 * @param {Object} Props For the component.
 * Reusable scale component.
 */

const ReveaScale: React.FC<ReveaScaleProps> = ({
  scale,
  minLabel,
  maxLabel,
  midLabel,
  currentValue,
  handleChange,
  hideValueLabels,
  showAllLabels,
}) => {
  const [value, setValue] = React.useState(currentValue);

  const handleScaleChange = (newValue: number) => {
    if (newValue !== value) {
      setValue(newValue);
      handleChange(newValue);
    }
  };

  const renderScaleButtons = () => {
    // eslint-disable-next-line no-undef
    const elements: JSX.Element[] = [];

    for (let i = MIN_VALUE; i <= scale; i++) {
      const buttonClass = classnames({
        'revea-scale__button': true,
        'revea-scale__button--active': value && i <= value,
        'scale__button-all--active': showAllLabels && value && i <= value,
        'scale__button-all--selected': showAllLabels && value && i === value,
      });

      const button = (
        <button
          className={buttonClass}
          onClick={() => handleScaleChange(i)}
          key={`button${i}`}
          data-testid={`button-${i}`}
        ></button>
      );

      elements.push(button);

      if (i !== scale) {
        const spanClass = classnames({
          'revea-scale__separator': true,
          'scale__separator-all--active': showAllLabels && value && i < value,
        });

        const span = <span className={spanClass} key={`separator${i}`} />;

        elements.push(span);
      }
    }

    return elements;
  };

  return (
    <div className="revea-scale">
      <div className="revea-scale__buttons-wrapper">{renderScaleButtons()}</div>

      {showAllLabels ? (
        <>
          <div className="scale__labels-numbers-all--wrapper">
            {[...Array(scale)].map((_, number) => (
              <span className="scale__numbers--text" key={number}>
                {number + 1}
              </span>
            ))}
          </div>

          <div className="revea-scale__labels-wrapper">
            <div className="text-left">
              {hideValueLabels ? null : <span className="font-weight-bold">{MIN_VALUE}</span>}
              <span>{minLabel}</span>
            </div>

            <div className="text-right">
              {hideValueLabels ? null : <span className="font-weight-bold">{scale}</span>}
              <span>{maxLabel}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="revea-scale__labels-wrapper">
          <div className="text-left">
            {hideValueLabels ? null : <span className="font-weight-bold">{MIN_VALUE}</span>}
            <span>{minLabel}</span>
          </div>

          {midLabel && (
            <div className="mid-label-wrapper">
              {hideValueLabels ? null : <span className="font-weight-bold">{Math.round(scale / 2)}</span>}
              <span>{midLabel}</span>
            </div>
          )}

          <div className="text-right">
            {hideValueLabels ? null : <span className="font-weight-bold">{scale}</span>}
            <span>{maxLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReveaScale;
