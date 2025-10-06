import { notifications, useNotifications } from "@mantine/notifications";
import notificationVariant from "./notificationVariant";

// interface optionsType {
//   message: string;
//   variant: string;
//   id?: string;
//   loading?: boolean;
//   description?: string;
//   autoClose?: boolean;
// }

/**
 * Updates the notification with the provided message, color, id, loading, description, and autoClose.
 *
 * @param {string} message - The message to be displayed in the notification.
 * @param {string} variant - The variant of the notification, which determines its appearance.
 * @param {string} id - The id of the notification element.
 * @param {boolean} loading - Whether or not the notification should display a loading spinner.
 * @param {string} description - The description of the notification.
 * @param {boolean} autoClose - Whether or not the notification should automatically close.
 */
export const updatedNotification = ({
  message,
  variant,
  id,
  loading,
  description,
  autoClose = true,
}) => {
  const notificationsStore = useNotifications();

  // let defaultValues: optionsType = {
  //   autoClose: true,
  //   ...options,
  // }

  if (notificationsStore.notifications.length > 0) {
    var color = notificationVariant[variant];
    const d = notificationsStore.notifications.find((d) => d.id === id);
    if (!d) {
      return null;
    }
    
    return notifications.update({
      id: id || 'notification',
      message: message,
      title: description,
      loading: loading,
      autoClose: autoClose ? 5000 : false,
      styles: (theme) => ({
        root: {
          backgroundColor: color,
          borderColor: color,
  
          "&::before": { backgroundColor: theme.white },
        },
  
        title: { color: theme.white },
        description: { color: theme.white },
        closeButton: {
          color: theme.white,
          '&:hover': { backgroundColor: color }
        },
      }),
    });
  }

  return null;
};
