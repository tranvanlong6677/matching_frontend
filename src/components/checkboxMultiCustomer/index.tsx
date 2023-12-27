import React, { useState } from 'react';

const CheckboxMultiCustom = ({
  options,
  onChange = [],
  value = undefined || null,
  vertical = false,
  error = false,
  horizontal = false,
  disabled = false,
}: any) => {
  const [checkedState, setCheckedState]: [any, React.Dispatch<any>] = useState(
    options?.map((item: any) => {
      return {
        ...item,
        active: false,
      };
    }),
  );

  const handleCheckbox = (position: any): void => {
    const updatedCheckedState = checkedState.map((item: any, index: number): any => {
      if (index === position) {
        return {
          ...item,
          active: !item.active,
        };
      } else {
        return {
          ...item,
        };
      }
    });

    onChange(updatedCheckedState?.filter((item: any) => item?.active));
    setCheckedState(updatedCheckedState);
  };

  return (
    <div className={`checkbox-wrapper${horizontal ? ' horizontal' : ''}${vertical ? ' vertical' : ''}`}>
      {checkedState.map((item: any, index: number) => (
        <div
          key={item.value}
          className={`checkbox-item${disabled ? ' disabled' : ''}`}
          onClick={() => handleCheckbox(index)}
        >
          <div className={`checkbox-custom${item?.active ? ' checked' : ''}${error ? ' error-checkbox' : ''}`}></div>
          <span className="checkbox-text">{item?.label}</span>
        </div>
      ))}
    </div>
  );
};

export default React.memo(CheckboxMultiCustom);
