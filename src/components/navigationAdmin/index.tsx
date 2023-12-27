import { useEffect, useState } from 'react';
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

import config from '../../config';

type NavType = {
  label: string;
  key: string;
  path: string;
  active: boolean;
  pathActive: string[];
};

const navList: NavType[] = [
  {
    label: '顧客一覧',
    key: '1',
    path: `${config.routes.customerList}`,
    pathActive: [config.routes.customerList, config.routes.adminCustomerDetail],
    active: false,
  },
  {
    label: 'キャスト一覧',
    key: '2',
    path: `${config.routes.castList}`,
    pathActive: [config.routes.castList, config.routes.detailCast, config.routes.adminCalendarCast],
    active: false,
  },
  {
    label: '予約一覧',
    key: '3',
    path: `${config.routes.bookingList}`,
    pathActive: [config.routes.bookingList],
    active: false,
  },
  {
    label: 'アンケート一覧',
    key: '4',
    path: `${config.routes.surveySheetList}`,
    pathActive: [config.routes.surveySheetList],
    active: false,
  },
  {
    label: 'クーポンコード',
    key: '5',
    path: `${config.routes.couponCode}`,
    pathActive: [config.routes.couponCode],
    active: false,
  },
  {
    label: '売上動向',
    key: '6',
    path: `${config.routes.revenueTrends}`,
    pathActive: [config.routes.revenueTrends],
    active: false,
  },
];
const Index = () => {
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();

  // HOOK STATE
  const [navItems, setNavItems]: any = useState<NavType[]>(navList);

  // HOOK EFFECT
  useEffect((): void => {
    const tmpNavList = navItems?.map((nav: NavType): any => {
      if (nav?.pathActive.find((pathActiveItem: any) => location?.pathname?.startsWith(pathActiveItem))) {
        return {
          ...nav,
          active: true,
        };
      }
      return {
        ...nav,
        active: false,
      };
    });
    setNavItems(tmpNavList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // HANDLE CLICK MENU
  const onClickMenu = (navItem: NavType): void => {
    const tmpNavList = navItems?.map((nav: NavType): any => {
      if (navItem?.key === nav?.key) {
        return {
          ...nav,
          active: true,
        };
      }
      return {
        ...nav,
        active: false,
      };
    });
    setNavItems(tmpNavList);
    navigate(navItem?.path);
  };

  return (
    <ul className="admin-nav">
      {navItems?.map((navItem: NavType) => {
        return (
          <li key={navItem?.key} onClick={() => onClickMenu(navItem)} className={`admin-nav-item${navItem?.active ? ' active' : ''}`}>
            {navItem?.label}
          </li>
        );
      })}
    </ul>
  );
};

export default Index;
