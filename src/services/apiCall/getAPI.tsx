import { apiCallProtected } from "../../api/axios";

interface optionsType {
  signal?: any;
  selectValue?: Function;
  returnFirstItem?: Boolean;
  returnObject?: Boolean;
  headers?: Object;
  file?: Boolean;
}

/** Get API call function */
export const getAPI = (url: string, options?: optionsType) => {
  return new Promise((resolve, reject) => {
    apiCallProtected
      .get(url, options?.headers)
      .then((response: any) => {
        if (response?.status?.toLowerCase() === 'success') {
          options?.selectValue && resolve(options?.selectValue(response))
          if (options?.returnFirstItem) {
            resolve(response?.data[0]);
          }else if (options?.returnObject) {
            resolve(response);
          }
          resolve(response?.data);
        } else if (options?.file) {
          resolve(response);
        } else {
          reject(response?.message);
        }
      })
      .catch((e)=> {
        reject(e?.message || e)
      });
  });
};