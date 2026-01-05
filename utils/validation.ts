import { TEXTS } from "@/constants/texts";
export const isEmail = (value: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

  return re.test(String(value).toLowerCase());
};

export const validatePassword = (value: string) => {
  if (!value) return TEXTS.Auth.passwordPlaceHolder;
  if (value.length < 6) return TEXTS.Auth.passwordLengthPlaceHolder;
  return "";
};
