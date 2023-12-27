import React, { useEffect, useState } from 'react';

const CheckboxCustom = ({
  options,
  onChange = [],
  value = undefined || null,
  vertical = false,
  error = false,
  horizontal = false,
  disabled = false,
  notAllowed = [],
}: any) => {
  // HOOK STATE
  const [tmpOptions, setTmpOptions]: [any, React.Dispatch<any>] = useState(
    options?.map((item: any) => {
      return {
        ...item,
        active: false,
      };
    }),
  );

  // CHECK NOT ALLOW OPTIONS
  const checkNotAllowOptions = (item: any) => {
    return notAllowed?.find((option: any): boolean => option === item.value);
  };

  // EFFECT HOOK
  useEffect((): void => {
    if (value !== undefined && value !== null) {
      const tmpCheckboxData = options?.map((itemCheckbox: any): any => {
        if (itemCheckbox.value === value) {
          return {
            ...itemCheckbox,
            active: true,
          };
        } else {
          return {
            ...itemCheckbox,
            active: false,
          };
        }
      });

      // SET STATES
      setTmpOptions(tmpCheckboxData);
    } else {
      const tmpCheckboxData = options?.map((itemCheckbox: any) => {
        return {
          ...itemCheckbox,
          active: false,
        };
      });
      setTmpOptions(tmpCheckboxData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // HANDLE CHECKED BUTTON
  const handleCheckedButton = (option: any): string => {
    if (option.active && !checkNotAllowOptions(option)) {
      return ' checked';
    } else {
      return '';
    }
  };

  // HANDLE CLICK TO CHECKED BUTTON
  const handleChecked = (item: any): void => {
    const tmpCheckboxData = tmpOptions?.map((itemOptions: any): any => {
      if (itemOptions.value === item.value) {
        return {
          ...itemOptions,
          active: !itemOptions?.active,
        };
      } else {
        return {
          ...itemOptions,
          active: false,
        };
      }
    });

    onChange(tmpCheckboxData?.find((itemFil: any) => itemFil?.active)?.value || null);
    setTmpOptions(tmpCheckboxData);
  };

  return (
    <div className={`checkbox-wrapper${horizontal ? ' horizontal' : ''}${vertical ? ' vertical' : ''}`}>
      {tmpOptions?.map((item: any) => (
        <div
          key={item.value}
          className={`checkbox-item${disabled ? ' disabled' : ''}${
            checkNotAllowOptions(item) ? ' disabled not-allowed' : ''
          }`}
          onClick={() => handleChecked(item)}
        >
          <div className={`checkbox-custom${handleCheckedButton(item)}${error ? ' error-checkbox' : ''}`}></div>
          <span className="checkbox-text">{item?.label}</span>
        </div>
      ))}
    </div>
  );
};

export default React.memo(CheckboxCustom);
