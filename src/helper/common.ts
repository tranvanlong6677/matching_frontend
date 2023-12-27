import { NotificationInstance } from 'antd/es/notification/interface';
import { CheckAgeType } from '../types/commonTypes';
import CryptoJS from 'crypto-js';
import { format } from 'date-fns';

export const setLocalStorage = (key: string, value: any): void => {
  const tmpData: string = CryptoJS.AES.encrypt(JSON.stringify(value), process.env.REACT_APP_HASH_KEY!).toString();
  localStorage.setItem(key, tmpData);
};

export const getLocalStorage = (key: string): any => {
  const itemStr: string | null = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }
  const tmpData: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(
    itemStr === null || itemStr === undefined ? '' : itemStr,
    process.env.REACT_APP_HASH_KEY!,
  );

  const item = JSON?.parse(tmpData?.toString(CryptoJS.enc.Utf8));
  return item;
};

export const alertSuccess = (api: NotificationInstance, message: string): void => {
  api.success({
    message,
    placement: 'topRight',
    duration: 1,
  });
};

export const alertFail = (api: NotificationInstance, message: string): void => {
  api.error({
    message,
    placement: 'topRight',
    duration: 3,
  });
};

export const checkAge = ({ year, month, day }: CheckAgeType): boolean | undefined => {
  const date: number = new Date().getFullYear();
  if (date - year < 18) {
    return false;
  } else if (date - year === 18) {
    const monthNow: number = new Date().getMonth() + 1;

    if (monthNow - month > 0) {
      return true;
    }
    if (monthNow - month < 0) {
      return false;
    }
    if (monthNow - month === 0) {
      const dayNow: number = new Date().getDate();
      if (dayNow - day > 0) {
        return true;
      }
      if (dayNow - day === 0) {
        return false;
      }
      if (dayNow - day < 0) {
        return false;
      }
    }
  } else {
    return true;
  }
};

export const checkPathUpdate = (path: string): boolean => {
  const pathArray: string[] = path.split('/');
  if (
    pathArray[1] === 'user' &&
    pathArray[2] === 'mypage' &&
    pathArray[3] === 'reserve' &&
    pathArray[4] === 'select' &&
    pathArray[6] === 'confirm'
  ) {
    return false;
  }
  return true;
};

export const checkPathDelete = (path: string): boolean => {
  const pathArray: string[] = path.split('/');
  if (
    (pathArray[1] === 'user' && pathArray[2] === 'mypage' && pathArray[3] === 'reserve' && pathArray[4] === 'select') ||
    pathArray[6] === 'cancel' ||
    pathArray[6] === 'cancel-confirm'
  ) {
    return false;
  }
  return true;
};

export const checkPathDeleteV2 = (path: string) => {
  const pathArray: string[] = path.split('/');
  if (
    pathArray[1] === 'user' &&
    pathArray[2] === 'mypage' &&
    pathArray[3] === 'reserve' &&
    pathArray[4] === 'select' &&
    pathArray[6] === 'cancel-confirm'
  ) {
    return false;
  }
  return true;
};

export const renderPassword = (number: number) => {
  let tmpArray = [];
  for (let i: number = 0; i < number; i++) {
    tmpArray.push('・');
  }
  return tmpArray.join().replaceAll(',', '');
};

export const getDateAfterTwoWeeks = () => {
  const date: Date = new Date();
  date.setDate(date.getDate() + 6);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const convertMoney = (data: string) => {
  return data?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// FORMAT CASH
export function formatCash(str: any) {
  if (str === undefined) {
    return '';
  } else
    return str
      .split('')
      .reverse()
      .reduce((prev: any, next: any, index: any) => {
        return (index % 3 ? next : next + ',') + prev;
      });
}

//FORMAT DATE YYYY MM/DD
export const convertDateMatching = (date: any): string => {
  const newDate = date && new Date(date);
  return date ? format(newDate, 'yyyy MM/dd ') : '';
};

//FORMAT POSTAL CODE
export const formatPostalCode = (postalCode: any) => {
  const formattedPostalCode = postalCode?.replace(/^(\d{3})(\d{4})$/, '$1-$2');
  return formattedPostalCode;
};

// CACULATE MONTH OPTIONS ADMIN
export const generateOptionsMonth = (): any => {
  const monthOptions: any = Array.from(Array(13).keys())?.map((month: number): any => {
    const date: Date = new Date();
    const newDate: Date = new Date(date.setMonth(date.getMonth() - month));
    return {
      id: month + 1,
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
      value: `${newDate.getMonth() + 1}-${newDate.getFullYear()}`,
      label: `${newDate.getFullYear()}年${newDate.getMonth() + 1}月`,
    };
  });

  return monthOptions;
};
