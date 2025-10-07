import {
  Button,
  Flex,
  PasswordInput,
  Text,
  TextInput,
  Image,
} from "@mantine/core";
import React from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import useAuthStore from "../../store/authStore";
import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "../../services/login/login";
import { IconAt } from "@tabler/icons-react";
import CryptoJS from "crypto-js";
import { URL } from "../../api/serverURLs";
import { displayNotification } from "@/commonComponents/notifications/displayNotification";
import { IconLock } from "@tabler/icons-react";

/**
 * The login page component.
 * It contains a form with username, password.
 * The form is validated using Mantine's useForm hook.
 * When the user submits the form, the handleLogin function is called.
 * The handleLogin function encrypts the username and password using a secret key and sets the encrypted values in the form field.
 * It creates a body object with the encrypted username and password, and
 * encrypts the body object using the same secret key.
 * Finally, it calls the login API mutation with the encrypted body object and stores the
 * response in the auth store.
 */
const Login = () => {
  const [remainingTime, setRemainingTime] = React.useState(0);
  // const [geoLocation, setGeoLocation] = React.useState({
  //   latitude: null,
  //   longitude: null
  // })

  const { saveAuth } = useAuthStore();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        !value?.trim()?.length ? "Please enter employee code" : null,
      password: (value) =>
        !value?.trim()?.length ? "Please enter password" : null,
    },
  });

  /**
   * When the remainingTime state is greater than 0,
   * it starts a timer to decrement the remainingTime
   * by 1 second every second. The timer is cleared when
   * the component is unmounted.
   */
  React.useEffect(() => {
    if (remainingTime > 0) {
      const timerId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [remainingTime]);

  /**
   *
   * This useEffect hook retrieves the user's current geolocation.
   * It is called only once when the component mounts, because the
   * empty dependency array indicates that it does not rely on any
   * values from the component's state or props.
   */
  // React.useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(position => {
  //     setGeoLocation({
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude
  //     })
  //   })
  // }, [])

  /**
   * The login API mutation.
   */
  const loginQuery = useMutation({
    mutationKey: "login",
    mutationFn: (body) => loginAPI({ body }),
  });

  /**
   * Called when a login button is clicked.
   * @description It encrypts the username and password using a secret key and sets the encrypted values
   * in the form field.
   * It creates a body object with the encrypted username and password, and
   * encrypts the body object using the same secret key.
   * Finally, it calls the login API mutation with the encrypted body object and stores the
   * response in the auth store.
   */
  const handleLogin = ({ type }) => {
    /**
     * The object containing the username and password entered by the user.
     */
    const bytes =
      type === "resend" &&
      CryptoJS.AES.decrypt(form?.values?.password, URL.secretKey);
    const decryptedString =
      type === "resend" && bytes.toString(CryptoJS.enc.Utf8);
    const body = {
      emp_code: form?.values?.username,
      password:
        type === "resend"
          ? JSON.parse(decryptedString)
          : form?.values?.password,
      origin: "web",
      device_id: null,
      // device_details: {
      //   lat: geoLocation?.latitude,
      //   lag: geoLocation?.longitude
      // }
    };
    /**
     * Encrypt the username and password using a secret key and set the encrypted values
     * in the form field.
     */
    form?.setFieldValue(
      "password",
      CryptoJS.AES.encrypt(
        JSON.stringify(form?.values?.password),
        URL.secretKey
      ).toString()
    );
    /**
     * Encrypt the body object using the same secret key.
     */
    const encryptData = CryptoJS.AES.encrypt(
      JSON.stringify(body),
      CryptoJS.enc.Utf8.parse(URL.secretKey),
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    )?.toString();
    /**
     * Call the login API mutation with the encrypted body object and store the response
     * in the auth store.
     */
    loginQuery.mutate(
      { encrypted_payload: encryptData },
      {
        /**
         * Called when the login API mutation is successful.
         * It stores the response in the auth store.
         * @description It sets the remaining time to 120 seconds.
         *            It sets the "otp" field in the form to true.
         */
        onSuccess: (data) => {
          saveAuth({ ...data });
        },
        /**
         * Called when the login API mutation is unsuccessful.
         * It displays a notification and clear the form fields.
         * @description It displays an error message in a notification.
         *             It clears the username and password form fields.
         */
        onError: (e) => {
          console.log(e);
          form?.setFieldValue("username", "");
          form?.setFieldValue("password", "");
          displayNotification({
            message: e,
            variant: "error",
          });
        },
      }
    );
  };

  /**
   * This function is called when the user tries to paste text into the password
   * input field.
   * It displays a notification with a warning message saying that the paste
   * option is restricted.
   *
   * @param {React.SyntheticEvent} event - The event object
   */
  // const handlePaste = event => {
  //   event.preventDefault()
  //   displayNotification({
  //     message: 'Paste option is restricted',
  //     variant: 'warning'
  //   })
  // }

  return (
    <Flex
      style={{ minHeight: "100vh" }}
      justify="center"
      align="center"
      direction="column"
      bg="gray.0" // Optional: add a light background
    >
      <form onSubmit={form.onSubmit((value) => handleLogin(value))}>
        <Flex
          gap={20}
          direction="column"
          align="center"
          justify="center"
        >
          <Image
            src={"/images/logo.png"}
            alt="logo"
            w={250}
            fit="contain"
          />
          <Text size="lg" fw={600} c="primary.9">
            E-Invocie Analyzer
          </Text>
          <Text mt="xs" mb="xs" size="20px">
            Enter Your Credentials
          </Text>
          <TextInput
            placeholder="Employee Id"
            size="md"
            w={300}
            rightSection={<IconAt size={16} />}
            {...form.getInputProps("username")}
          />
          <PasswordInput
            placeholder="Password"
            visible={false}
            rightSection={<IconLock size={16} />}
            size="md"
            w={300}
            {...form.getInputProps("password")}
          />
          <Button
            w={300}
            size="md"
            variant="filled"
            type="submit"
            rightSection={<IconArrowRight size={18} />}
            loading={loginQuery?.isPending}
          >
            Login
          </Button>
        </Flex>
        <Text ta="center" mt="lg" c={'primary.9'} size="xs">
          V{import.meta.env.VITE_APP_VERSION}
        </Text>
      </form>
    </Flex>
  );
  
};

export default Login;
