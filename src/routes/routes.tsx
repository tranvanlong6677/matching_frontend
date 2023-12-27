import React, { ExoticComponent } from 'react';
import config from '../config';
// ------------------LAYOUT---------------
import DefaultLayout from '../layouts/DefaultLayout';
import RegisterSchedule from '../pages/cast/castSchedule/registerSchedule';

import CastLogout from '../pages/auth/cast/logout/castLogout';
import CustomerLogout from '../pages/auth/cast/logout/customerLogout';
import CastReportSuccess from '../pages/cast/castRequestDetail/castReportSuccess';
import ChangeScheduleSuccess from '../pages/cast/castSchedule/changeSchedule/changeScheduleSuccess';
import ChangePasswordSuccess from '../pages/cast/castInformation/changePassword/changePasswordSuccess';
import DeleteCustomerSuccess from '../pages/customer/customerInformation/customerDeleteAccount/deleteCustomerSuccess';
import CustomerChangePasswordSuccess from '../pages/customer/customerInformation/changePassword/customerChangePasswordSuccess';

// ADMIN
import { LazyLoadType } from '../types/routes';
import AdminLogin from '../pages/admin/login';
import CastList from '../pages/admin/cast/castList';
import DetailCast from '../pages/admin/cast/detailCast';
import CouponCode from '../pages/admin/coupon/couponCode';
import BookingList from '../pages/admin/bookingList/bookingList';
import DefaultLayoutAdmin from '../layouts/DefaultLayoutAdmin';
import CustomerList from '../pages/admin/customer/customerList';
import CalendarComponent from '../pages/admin/calendar/calendar';
import RevenueTrends from '../pages/admin/revenueTrends/revenueTrends';
import CustomerDetail from '../pages/admin/customer/customerDetail';
import SurveySheetList from '../pages/admin/surveySheetList/surveySheetList';
import CustomerSurveySuccess from '../pages/customer/customerDashboard/customerBooking/customerSurvey/customerSurveySuccess';
import DefaultLayoutLogin from '../layouts/DefaultLayoutLogin';
import CustomerBooking from '../pages/customer/customerDashboard/customerBooking';
import ChooseService from '../pages/customer/customerSchedule/chooseService';
import CustomerInformation from '../pages/customer/customerInformation';
import CustomerRequestHistory from '../pages/customer/customerDashboard/customerRequestHistory';
import CustomerQuestions from '../pages/customer/customerDashboard/customerQuestions';
import CastInformation from '../pages/cast/castInformation';
import CastQuestion from '../pages/cast/castQuestion';
import ChangeCreditCard from '../pages/customer/customerInformation/changeCreditCard';
import CustomerEditBank from '../pages/customer/customerInformation/customerEditBank';
import CustomerRebookComplete from '../pages/customer/customerDashboard/customerRequestHistory/customerRebookComplete';
import CastCompleteChangePassword from '../pages/cast/castInformation/changePassword/changePasswordSuccess/completeChangePassword';
import CustomerCompleteChangePassword from '../pages/customer/customerInformation/changePassword/customerChangePasswordSuccess/CustomerCompleteChangePassword';
import CustomerAskedQuestions from '../pages/customer/customerQuestion';
import CustomerDashboard from '../pages/customer/customerDashboard';
const CustomerConfirmUpdateBooking = React.lazy(
  () => import('../pages/customer/customerDashboard/customerBooking/comfirmChangeBooking/confirmChangeUpdateBooking'),
);

// CAST
const Home: LazyLoadType = React.lazy(() => import('../pages/home'));
const Login: LazyLoadType = React.lazy(() => import('../pages/auth/cast/login'));
const CastSignUp: LazyLoadType = React.lazy(() => import('../pages/auth/cast/castSignUp'));
const CastBankDetail: LazyLoadType = React.lazy(
  () => import('../pages/cast/castInformation/castDetails/castBankDetail'),
);
const SignUpBank: LazyLoadType = React.lazy(() => import('../pages/auth/cast/signUpBank'));
const CastDashboard: LazyLoadType = React.lazy(() => import('../pages/cast/castDashboard'));
const SendEmailReg: LazyLoadType = React.lazy(() => import('../pages/auth/cast/sendEmailReg'));
const CastRequestDetail: LazyLoadType = React.lazy(() => import('../pages/cast/castRequestDetail'));
const ConfirmRegister: LazyLoadType = React.lazy(() => import('../pages/auth/cast/confirmRegister'));
const EditCast: LazyLoadType = React.lazy(() => import('../pages/cast/castInformation/editCastSignUp'));
const CastDetails: LazyLoadType = React.lazy(() => import('../pages/cast/castInformation/castDetails'));
const CompleteSendEmail: LazyLoadType = React.lazy(() => import('../pages/auth/cast/completeSendEmail'));
const CheckCompleteEmail: LazyLoadType = React.lazy(() => import('../pages/auth/cast/checkCompleteEmail'));
const CastChangeSchedule: LazyLoadType = React.lazy(() => import('../pages/cast/castSchedule/changeSchedule'));
const CastDeleteAccount: LazyLoadType = React.lazy(() => import('../pages/cast/castInformation/castDeleteAccount'));
const CastScheduleSuccess: LazyLoadType = React.lazy(() => import('../pages/cast/castSchedule/castScheduleSuccess'));
const RegisterSuccess: LazyLoadType = React.lazy(() => import('../pages/auth/cast/confirmRegister/registerSuccess'));
const EditSuccess: LazyLoadType = React.lazy(() => import('../pages/cast/castInformation/editCastSignUp/editSuccess'));
const NewPassword: LazyLoadType = React.lazy(() => import('../pages/cast/castInformation/changePassword/newPassword'));
const CalendarDetail: LazyLoadType = React.lazy(
  () => import('../pages/cast/castDashboard/calendarDetail/calendarDetail'),
);
const SendEmailChangePassword: LazyLoadType = React.lazy(
  () => import('../pages/cast/castInformation/changePassword/sendEmailChangePassword'),
);

//CUSTOMER ---------------------------------
const CustomerHearing: LazyLoadType = React.lazy(() => import('../pages/customer/customerHearing'));
const LoginCustomer: LazyLoadType = React.lazy(() => import('../pages/auth/customer/loginCustomer'));
const NotedRegister: LazyLoadType = React.lazy(() => import('../pages/auth/customer/notedRegister'));
const CustomerSignUpBank: LazyLoadType = React.lazy(() => import('../pages/auth/customer/signupBank'));
const CustomerChangeService: LazyLoadType = React.lazy(() => import('../pages/customer/changeService'));
const ContactSuccess: LazyLoadType = React.lazy(() => import('../pages/cast/castQuestion/ContactSuccess'));
const SendEmailRegCustomer: LazyLoadType = React.lazy(() => import('../pages/auth/customer/sendEmailReg'));
const ConfirmRegisterCustomer: LazyLoadType = React.lazy(() => import('../pages/auth/customer/confirmRegister'));
const CustomerEdit: LazyLoadType = React.lazy(() => import('../pages/customer/customerInformation/customerEdit'));
const ScheduleDetail: LazyLoadType = React.lazy(() => import('../pages/customer/customerSchedule/scheduleDetail'));
const CustomerSignUp: ExoticComponent<any> = React.lazy(() => import('../pages/auth/customer/customerSignUp/index'));
const CustomerConfirmHearing: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerHearing/customerConfirm'),
);
const RegisterCustomerSuccess: LazyLoadType = React.lazy(
  () => import('../pages/auth/customer/confirmRegister/registerSuccess'),
);
const CustomerDeleteBooking: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerDeleteBooking'),
);
const CustomerHearingSuccess: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerHearing/customerHearingSuccess'),
);
const CustomerDeleteAccount: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerInformation/customerDeleteAccount'),
);
const CustomerConfirmInformation: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerSchedule/confirmScheduleInfo'),
);
const DetailCustomer: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerInformation/customerDetail/detailCustomer'),
);
const CompleteSendEmailCustomer: LazyLoadType = React.lazy(
  () => import('../pages/auth/customer/completeSendEmail/completeSendEmail'),
);
const NewPasswordCustomer: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerInformation/changePassword/newPassword'),
);
const CustomerBookingDetail: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerBooking/bookingDetail'),
);
const CustomerChangeBooking: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerBooking/changeBooking'),
);
const EditCustomerSuccess: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerInformation/customerEdit/editCustomerSuccess'),
);
const CastDeleteAccountSuccess: LazyLoadType = React.lazy(
  () => import('../pages/cast/castInformation/castDeleteAccount/CastDeleteAccountSuccess'),
);
const CustomerBookingSuccess: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerBooking/customerBookingSuccess'),
);
const CustomerChangeSchedule: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerBooking/customerChangeSchedule'),
);
const CustomerChangeHistory: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerRequestHistory/customerChangeHistory'),
);
const ConfirmChangeBooking: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerBooking/comfirmChangeBooking/confirmChange'),
);
const CustomerSendEmailChangePassword: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerInformation/changePassword/sendEmailChangePassword'),
);
const CustomerDeleteBookingSuccess: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerDeleteBooking/customerDeleteSuccess'),
);

const ReConfirmChangeBooking: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerBooking/comfirmChangeBooking/reConfirmChange'),
);
const CustomerEditCoupon: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerBooking/changeBooking/editChangeBooking'),
);
const CustomerSurvey: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerBooking/customerSurvey/customerSurvey'),
);

const CustomerQuestionDetail: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerQuestions/questionDetail'),
);
const QuestionSuccess: LazyLoadType = React.lazy(
  () => import('../pages/customer/customerDashboard/customerQuestions/questionSuccess'),
);

export const castRoutes: any = [
  { path: config.routes.editCast, component: EditCast, layout: DefaultLayout },
  { path: config.routes.castDetails, component: CastDetails, layout: DefaultLayout },
  { path: config.routes.castBankDetail, component: CastBankDetail, layout: DefaultLayout },
  { path: config.routes.castDashboard, component: CastDashboard, layout: DefaultLayout },
  { path: config.routes.editCastSuccess, component: EditSuccess, layout: DefaultLayout },
  { path: config.routes.castSchedule, component: RegisterSchedule, layout: DefaultLayout },
  { path: config.routes.castInformation, component: CastInformation, layout: DefaultLayout },
  { path: config.routes.deleteCastAccount, component: CastDeleteAccount, layout: DefaultLayout },
  { path: config.routes.castScheduleSuccess, component: CastScheduleSuccess, layout: DefaultLayout },
  { path: config.routes.sendEmailChangePassword, component: SendEmailChangePassword, layout: DefaultLayout },

  { path: config.routes.castQuestion, component: CastQuestion, layout: DefaultLayout },
  { path: config.routes.castQuestionSuccess, component: ContactSuccess, layout: DefaultLayout },

  { path: config.routes.castReport, component: CastRequestDetail, layout: DefaultLayout },
  { path: config.routes.castReportSuccess, component: CastReportSuccess, layout: DefaultLayout },
  { path: `${config.routes.calendarDetail}/:matchingId`, component: CalendarDetail, layout: DefaultLayout },
  {
    path: `${config.routes.castChangeSchedule}/:matchingId/applicate`,
    component: CastChangeSchedule,
    layout: DefaultLayout,
  },
  {
    path: `${config.routes.castChangeScheduleSuccess}/:matchingId/complete`,
    component: ChangeScheduleSuccess,
    layout: DefaultLayout,
  },
  { path: config.routes.castCompleteChangePassword, component: CastCompleteChangePassword, layout: DefaultLayout },

  // PUBLIC
  { path: config.routes.signUpBankEdit, component: SignUpBank, layout: DefaultLayout },
  { path: config.routes.confirmRegisterEdit, component: ConfirmRegister, layout: DefaultLayout },
];

export const customerRoutes: any = [
  { path: config.routes.editCustomer, component: CustomerEdit, layout: DefaultLayout, checkEkyc: true },
  { path: config.routes.detailCustomer, component: DetailCustomer, layout: DefaultLayout, checkEkyc: true },
  { path: config.routes.customerBooking, component: CustomerBooking, layout: DefaultLayout, checkEkyc: true },
  { path: config.routes.customerDashboard, component: CustomerDashboard, layout: DefaultLayout },
  { path: config.routes.customerScheduleService, component: ChooseService, layout: DefaultLayout, checkEkyc: true },
  { path: config.routes.customerScheduleDetail, component: ScheduleDetail, layout: DefaultLayout, checkEkyc: true },
  { path: config.routes.customerInformation, component: CustomerInformation, layout: DefaultLayout, checkEkyc: true },
  { path: config.routes.customerEditSuccess, component: EditCustomerSuccess, layout: DefaultLayout, checkEkyc: true },
  {
    path: config.routes.confirmBookingCustomer,
    component: ConfirmChangeBooking,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerBookingDetail,
    component: CustomerBookingDetail,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerBookingDetailHistory,
    component: CustomerBookingDetail,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerChangeService,
    component: CustomerChangeService,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.deleteCustomerAccount,
    component: CustomerDeleteAccount,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerDeleteBooking,
    component: CustomerDeleteBooking,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerChangeSchedule,
    component: CustomerChangeSchedule,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  { path: config.routes.customerConfirmHearing, component: CustomerConfirmHearing, layout: DefaultLayout },
  { path: config.routes.customerRequestHistory, component: CustomerRequestHistory, layout: DefaultLayout },
  { path: config.routes.reConfirmChangeBookingDelete, component: ReConfirmChangeBooking, layout: DefaultLayout },
  {
    path: config.routes.reConfirmChangeBookingUpdate,
    component: CustomerEditCoupon,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.reConfirmChangeBookingHistory,
    component: CustomerEditCoupon,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerConfirmUpdateBooking,
    component: CustomerConfirmUpdateBooking,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerConfirmHistory,
    component: CustomerConfirmUpdateBooking,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerAskedQuestions,
    component: CustomerAskedQuestions,
    layout: DefaultLayout,
    checkEkyc: true,
  },

  {
    path: `${config.routes.customerChangeBooking}/:id`,
    component: CustomerChangeBooking,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: `${config.routes.customerChangeHistory}/:id`,
    component: CustomerChangeHistory,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerConfirmInformation,
    component: CustomerConfirmInformation,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerDeleBookingSuccess,
    component: CustomerDeleteBookingSuccess,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  { path: config.routes.customerRebookSuccess, component: CustomerRebookComplete, layout: DefaultLayout },

  {
    path: config.routes.customerSendEmailChangePassword,
    component: CustomerSendEmailChangePassword,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  { path: config.routes.customerQuestions, component: CustomerQuestions, layout: DefaultLayout, checkEkyc: true },
  {
    path: `${config.routes.customerQuestionDetail}/:id`,
    component: CustomerQuestionDetail,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  { path: config.routes.customerQuestionSuccess, component: QuestionSuccess, layout: DefaultLayout, checkEkyc: true },
  // CUSTOMER HEARING
  { path: config.routes.customerHearing, component: CustomerHearing, layout: DefaultLayout },
  { path: config.routes.customerHearingSuccess, component: CustomerHearingSuccess, layout: DefaultLayout },

  // public
  { path: config.routes.customerSignupBankEdit, component: CustomerEditBank, layout: DefaultLayout, checkEkyc: true },
  {
    path: config.routes.customerBookingSuccess,
    component: CustomerBookingSuccess,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.confirmRegisterCustomerEdit,
    component: ConfirmRegisterCustomer,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.confirmChangeInfoCreditCardEdit,
    component: ChangeCreditCard,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  { path: `${config.routes.customerSurvey}/:id`, component: CustomerSurvey, layout: DefaultLayout, checkEkyc: true },
  {
    path: config.routes.customerSurveySuccess,
    component: CustomerSurveySuccess,
    layout: DefaultLayout,
    checkEkyc: true,
  },
  {
    path: config.routes.customerCompleteChangePassword,
    component: CustomerCompleteChangePassword,
    layout: DefaultLayout,
    checkEkyc: true,
  },
];

export const changePasswordRoutes: any = [
  { path: config.routes.newPasswordCustomer, component: NewPasswordCustomer, layout: DefaultLayout },
  { path: config.routes.newPassword, component: NewPassword, layout: DefaultLayout },
];

export const publicRoutes: any = [
  // CAST PUBLIC ROUTES
  { path: config.routes.login, component: Login, layout: DefaultLayoutLogin },
  { path: config.routes.castSignUp, component: CastSignUp, layout: DefaultLayout },
  { path: config.routes.signUpBank, component: SignUpBank, layout: DefaultLayout },
  { path: config.routes.logoutCast, component: CastLogout, layout: DefaultLayout },
  { path: config.routes.confirmRegister, component: ConfirmRegister, layout: DefaultLayout },
  { path: config.routes.registerSuccess, component: RegisterSuccess, layout: DefaultLayout },
  { path: config.routes.sendMailToRegister, component: SendEmailReg, layout: DefaultLayout },
  { path: config.routes.checkCompleteEmail, component: CheckCompleteEmail, layout: DefaultLayout },
  { path: config.routes.completeSendEmailSignUp, component: CompleteSendEmail, layout: DefaultLayout },
  { path: config.routes.changPasswordSuccess, component: ChangePasswordSuccess, layout: DefaultLayout },
  { path: config.routes.deleteCastAccountSuccess, component: CastDeleteAccountSuccess, layout: DefaultLayout },

  // CUSTOMER PUBLIC ROUTES
  { path: config.routes.loginCustomer, component: LoginCustomer, layout: DefaultLayoutLogin },
  { path: config.routes.notedRegister, component: NotedRegister, layout: DefaultLayout },
  { path: config.routes.signupCustomer, component: CustomerSignUp, layout: DefaultLayout },
  { path: config.routes.logoutCustomer, component: CustomerLogout, layout: DefaultLayout },
  { path: config.routes.customerSignupBank, component: CustomerSignUpBank, layout: DefaultLayout },
  { path: config.routes.sendMailtoCustomer, component: SendEmailRegCustomer, layout: DefaultLayout },
  { path: config.routes.customerCheckCompleteEmail, component: CheckCompleteEmail, layout: DefaultLayout },
  { path: config.routes.confirmRegisterCustomer, component: ConfirmRegisterCustomer, layout: DefaultLayout },
  { path: config.routes.registerCustomerSuccess, component: RegisterCustomerSuccess, layout: DefaultLayout },
  { path: config.routes.deleteCustomerAccountSuccess, component: DeleteCustomerSuccess, layout: DefaultLayout },
  { path: config.routes.completeSendEmailSignUpCustomer, component: CompleteSendEmailCustomer, layout: DefaultLayout },
  {
    path: config.routes.customerChangePasswordSuccess,
    component: CustomerChangePasswordSuccess,
    layout: DefaultLayout,
  },

  // ADMIN ROUTE
];

export const castSignUpRoutes: any = [
  { path: config.routes.castSignUp, component: CastSignUp, layout: DefaultLayout },
  { path: config.routes.signUpBank, component: SignUpBank, layout: DefaultLayout },
  { path: config.routes.confirmRegister, component: ConfirmRegister, layout: DefaultLayout },
];

export const customerSignUpRoutes: any = [
  { path: config.routes.notedRegister, component: NotedRegister, layout: DefaultLayout },
  { path: config.routes.signupCustomer, component: CustomerSignUp, layout: DefaultLayout },
  { path: config.routes.customerSignupBank, component: CustomerSignUpBank, layout: DefaultLayout },
  { path: config.routes.confirmRegisterCustomer, component: ConfirmRegisterCustomer, layout: DefaultLayout },
];

export const superPublicRoutes: any = [
  { path: config.routes.home, component: Home },
  { path: config.routes.adminLogin, component: AdminLogin },
];

export const adminRoutes: any = [
  { path: config.routes.castList, component: CastList, layout: DefaultLayoutAdmin },
  { path: config.routes.couponCode, component: CouponCode, layout: DefaultLayoutAdmin },
  { path: config.routes.bookingList, component: BookingList, layout: DefaultLayoutAdmin },
  { path: config.routes.customerList, component: CustomerList, layout: DefaultLayoutAdmin },
  { path: config.routes.revenueTrends, component: RevenueTrends, layout: DefaultLayoutAdmin },
  { path: `${config.routes.detailCast}/:id`, component: DetailCast, layout: DefaultLayoutAdmin },
  { path: config.routes.surveySheetList, component: SurveySheetList, layout: DefaultLayoutAdmin },
  { path: `${config.routes.adminCustomerDetail}/:id`, component: CustomerDetail, layout: DefaultLayoutAdmin },
  { path: `${config.routes.adminCalendarCast}/:id`, component: CalendarComponent, layout: DefaultLayoutAdmin },
];
