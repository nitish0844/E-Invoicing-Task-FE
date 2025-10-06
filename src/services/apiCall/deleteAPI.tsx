import { apiCallProtected } from "../../api/axios";

interface options {
  body?: Object;
  selectValue?: Function;
  returnFirstItem?: Boolean;
  returnObject?: Boolean;
}

/** Post API Call Function */
export const deleteAPI = (url: string, options?: options) => {
  return new Promise((resolve, reject) => {
    apiCallProtected
      .delete(url, options?.body)
      .then((response: any) => {
        if (response?.status?.toLowerCase() === 'success') {
          options?.selectValue && resolve(options?.selectValue(response?.data))
          if (options?.returnFirstItem) {
            resolve(response?.data[0]);
          } else if (options?.returnObject) {
            resolve(response);
          }
          resolve(response?.data);
        } else {
          reject(response?.message);
        }
      })
      .catch((e)=> {
        reject(e?.message || e)
      });
  });
};