import React from "react";
import debounce from "lodash.debounce";
import { checkUsername } from "../api/Auth/authApi";

export const useCheckUsername = () => {
  const [status, setStatus] = React.useState<{
    available?: boolean;
    message?: string;
    loading: boolean;
  }>({ loading: false });

  const debouncedCheck = debounce(async (username: string) => {
    if (!username || username.length < 3) return;

    try {
      setStatus({ loading: true });

      const res = await checkUsername(username);

      setStatus({
        available: res.available,
        message: res.message,
        loading: false,
      });
    } catch {
      setStatus({
        available: false,
        message: "Error checking username",
        loading: false,
      });
    }
  }, 500);

  return { status, debouncedCheck };
};
