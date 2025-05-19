import { CustomError, isCustomError } from "@/services/config/api.model";
import { ErrorDetail } from "./error.model";
import { useTranslation } from "react-i18next";
import { SerializedError } from "@reduxjs/toolkit";

type ErrorToParse = CustomError | SerializedError | undefined;

export const useErrorParser = () => {
  const { t } = useTranslation();

  const getTranslatedMessage = (error: ErrorToParse): string => {
    if (!error || !isCustomError(error)) {
      return t("UNKNOWN", { ns: "errors" });
    }

    const code = error.response?.data?.code;
    const message = error.response?.data?.message;

    return code
      ? t(code, { ns: "errors" })
      : message ?? t("UNKNOWN", { ns: "errors" });
  };

  const translateError = (error: ErrorToParse): ErrorDetail | string => {
    // TODO - handle detailed errors
    return getTranslatedMessage(error);
  };

  const translateInlineError = (error: ErrorToParse): string => {
    return getTranslatedMessage(error);
  };

  return { translateError, translateInlineError };
};
