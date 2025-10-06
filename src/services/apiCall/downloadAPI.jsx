import { apiCallProtected } from "../../api/axios";

/** Get API call function */
export const downloadAPI = (url, options) => {
  return new Promise((resolve, reject) => {
    apiCallProtected
      .get(url)
      .then((response) => {
        const link = document.createElement('a');
        link.href = `data:application/xlsx;base64,${response}`;
        link.setAttribute('download', `${options?.fileName || 'file'}.xlsx`); // Use the extracted filename
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        resolve(response);
      })
      .catch((e)=> {
        console.log(e)
        reject(e?.message || e)
      });
  });
};