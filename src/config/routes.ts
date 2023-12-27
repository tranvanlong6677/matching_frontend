const routes = {
  // AUTH ROUTE
  // ->>>>>>>>>>  CAST

  login: '/cast/login',
  castSignUp: '/cast/signup',
  sendMailToRegister: '/cast/register',
  signUpBank: '/cast/signup/credit',
  confirmRegister: '/cast/signup/check',
  registerSuccess: '/cast/signup/complete',
  completeSendEmailSignUp: '/cast/register/complete',
  checkCompleteEmail: '/cast/register/complete-check',

  castDashboard: '/cast/mypage',
  deleteCastAccount: '/cast/mypage/detail/settings/deleteservices',
  castReport: '/cast/mypage/job/report',
  castReportSuccess: '/cast/mypage/job/finish',

  castInformation: '/cast/mypage/detail/settings',
  castDetails: '/cast/mypage/detail/settings/detail',
  castBankDetail: '/cast/mypage/detail/setting/credit',
  editCast: '/cast/mypage/detail/settings/revise',
  signUpBankEdit: '/cast/mypage/detail/settings/revise/credit',
  confirmRegisterEdit: '/cast/mypage/detail/settings/confirm',
  editCastSuccess: '/cast/mypage/detail/settings/complete',

  sendEmailChangePassword: '/cast/mypage/detail/settings/password',
  newPassword: '/cast/mypage/detail/settings/password/applicate',
  changPasswordSuccess: '/cast/mypage/detail/settings/password/complete',
  castCompleteChangePassword: '/cast/mypage/detail/settings/password/success',

  castSchedule: '/cast/mypage/shift',
  castScheduleSuccess: '/cast/mypage/shift/complete',
  castQuestion: '/cast/contact',
  castQuestionSuccess: '/cast/contact/complete',
  calendarDetail: '/cast/mypage/job',
  castChangeSchedule: '/cast/mypage/job',
  castChangeScheduleSuccess: '/cast/mypage/job',
  deleteCastAccountSuccess: '/cast/mypage/detail/settings/deleteservices/complete',

  // CUSTOMER ROUTE
  loginCustomer: '/user/login',
  signupCustomer: '/user/signup',
  sendMailtoCustomer: '/user/register',
  completeSendEmailSignUpCustomer: '/user/register/complete',
  customerCheckCompleteEmail: '/user/register/complete-check',
  notedRegister: '/user/register/complete-note',
  customerSignupBank: '/user/signup/credit',
  confirmRegisterCustomer: '/user/signup/check',
  registerCustomerSuccess: '/user/signup/complete',

  customerDashboard: '/user/mypage',
  customerQuestions: '/user/mypage/questions',
  customerQuestionDetail: '/user/mypage/questions/detail',
  customerQuestionSuccess: '/user/mypage/questions/success',
  customerHearing: '/user/mypage/hearing',
  customerAskedQuestions: '/user/mypage/asked-questions',

  customerHearingSuccess: '/user/mypage/hearing/complete',

  customerInformation: '/user/mypage/detail/settings',
  detailCustomer: '/user/mypage/detail/settings/detail',
  editCustomer: '/user/mypage/detail/settings/revise',
  customerSignupBankEdit: '/user/mypage/detail/settings/revise/credit',
  confirmRegisterCustomerEdit: '/user/mypage/detail/settings/confirm',
  confirmChangeInfoCreditCardEdit: '/user/mypage/detail/settings/revise/credit/confirm',
  customerEditSuccess: '/user/mypage/detail/settings/complete',

  deleteCustomerAccount: '/user/mypage/detail/settings/deleteservices',
  deleteCustomerAccountSuccess: '/user/mypage/detail/settings/deleteservices/complete',

  customerBooking: '/user/mypage/reserve',
  customerBookingExtend: `/user/mypage/reserve/extend`,
  customerChangeBooking: '/user/mypage/reserve/select',
  confirmBookingCustomer: '/user/confirm-booking',

  // SAME COMPONENT
  reConfirmChangeBookingDelete: '/user/mypage/reserve/select/:id/cancel-confirm',
  reConfirmChangeBookingUpdate: '/user/mypage/reserve/select/:id/confirm',
  reConfirmChangeBookingHistory: '/user/mypage/reserve/select/history/confirm',

  // re: '/user/mypage/reserve/select/:id/confirm',
  customerSendEmailChangePassword: '/user/mypage/detail/settings/password',
  customerRequestBooking: '/user/request-booking',
  customerChangeService: '/user/mypage/reserve-2',
  customerScheduleService: '/user/mypage/booking',
  customerChangeSchedule: '/user/schedule/edit',
  customerConfirmHearing: '/user/hearing/confirm',
  customerScheduleDetail: '/user/mypage/booking/soji',
  customerBookingDetail: '/user/mypage/booking/price',
  customerBookingDetailHistory: '/user/mypage/booking/history/price',
  customerBookingSuccess: '/user/mypage/reserve/complete',
  customerConfirmInformation: '/user/mypage/booking/confirm',
  customerConfirmInformationHistory: '/user/mypage/booking/history/confirm',

  // SAME COMPONENT
  customerConfirmUpdateBooking: '/user/mypage/reserve/select/:id/update',
  customerConfirmHistory: '/user/mypage/reserve/select/history',

  newPasswordCustomer: '/user/mypage/detail/settings/password/applicate',
  customerDeleteBooking: '/user/mypage/reserve/select/:id/cancel',
  customerDeleBookingSuccess: '/user/mypage/reserve/cancel-complete',
  customerChangePasswordSuccess: '/user/mypage/detail/settings/password/complete',
  customerRequestHistory: '/user/mypage/request-history',
  customerChangeHistory: '/user/mypage/reserve/history/select',
  // reConfirmChangeBookingHistory: '/user/mypage/reserve/history/select/:id/confirm',
  customerSurvey: '/user/mypage/booking/survey',
  customerSurveySuccess: '/user/mypage/booking/survey/complete',
  customerRebookSuccess: '/user/mypage/reserve/select/history/complete',
  customerCompleteChangePassword: '/user/mypage/detail/settings/password/success',

  // CAST PUBLIC ROUTE
  home: '/',
  logoutCast: '/cast/logout',
  logoutCustomer: '/user/logout',
  // VIEW ROUTE
  // DELETE

  //   ADMIN ROUTE
  // admin routes
  adminLogin: '/admin-dashboard/login',
  customerList: '/admin-dashboard/customer-list',
  castList: '/admin-dashboard/cast-list',
  detailCast: '/admin-dashboard/cast-detail',
  bookingList: '/admin-dashboard/booking-list',
  surveySheetList: '/admin-dashboard/survey-sheet-list',
  couponCode: '/admin-dashboard/coupon-code',
  revenueTrends: '/admin-dashboard/revenue-trends',
  adminCustomerDetail: '/admin-dashboard/customer-detail',
  adminCalendarCast: '/admin-dashboard/cast/calendar',
};

export default routes;
