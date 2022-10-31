// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiMaster:'888',
  recaptcha: {
    siteKey: '6LfKNi0cAAAAACeYwFRY9_d_qjGhpiwYUo5gNW5-',
  },
  // fileUrl:'https://goldenventure.nichetechnosolution.com/admin',
  // apiUrl:'https://goldenventure.nichetechnosolution.com/admin/api',

  fileUrl:'https://goldenventure.ca/admin',
  apiUrl:'https://goldenventure.ca/admin/api',
  // fileUrl:'https://goldenventure.ca/admin',
  // apiUrl:'http://192.168.1.181/immigration_admin/api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
