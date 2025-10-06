import { displayNotification } from "../../notifications/displayNotification";

const exportData = (fileUrl) => {
  if (fileUrl) {
    const link = document.createElement('a');
    link.href = fileUrl.startsWith('http') ? fileUrl : `${URL.base.slice(0, -1)}${fileUrl}`;
    link.target = "_blank";
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    displayNotification({
      message: 'File Download Failed',
      variant: 'error',
    });
  }
}

export default exportData;