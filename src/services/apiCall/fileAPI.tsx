import { apiCallFileProtected } from "../../api/axios";

interface options {
  body?: Object;
  selectValue?: Function;
  returnFirstItem?: Boolean;
  returnErrorObject?: Boolean;
  returnObject?: Boolean;
  headers?: Object;
}

/** Post API Call Function */
export const fileAPI = (url: string, options?: options) => {
  return new Promise((resolve, reject) => {
    apiCallFileProtected
      .post(url, options?.body, {})
      .then(({data}: any) => {
        if (data?.data?.status?.toLowerCase() === 'success') {
          options?.selectValue && resolve(options?.selectValue(data?.data))
          if (options?.returnFirstItem) {
            resolve(data?.data[0]);
          } else if (options?.returnObject) {
            resolve(data);
          }
          resolve(data?.data);
        } else {
          options?.returnErrorObject && reject(data);
          reject(data?.message);
        }
      })
      .catch((e)=> {
        reject(e?.message || e)
      });
  });
};