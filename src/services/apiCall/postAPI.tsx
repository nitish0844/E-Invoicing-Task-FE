import { apiCallProtected } from "../../api/axios";

interface options {
  body?: Object;
  selectValue?: Function;
  returnFirstItem?: Boolean;
  returnErrorObject?: Boolean;
  returnObject?: Boolean;
  headers?: Object;
}

/** Post API Call Function */
export const postAPI = (url: string, options?: options) => {
  return new Promise((resolve, reject) => {
    apiCallProtected
      .post(url, options?.body, options?.headers)
      .then((response: any) => {
        if (response?.status?.toLowerCase() === "success") {
          options?.selectValue && resolve(options?.selectValue(response?.data));
          if (options?.returnFirstItem) {
            resolve(response?.data[0]);
          } else if (options?.returnObject) {
            resolve(response);
          }
          resolve(response?.data);
        } else {
          options?.returnErrorObject && reject(response);
          reject(response?.message);
        }
      })
      .catch((e) => {
        reject(e?.message || e);
      });
  });
};
