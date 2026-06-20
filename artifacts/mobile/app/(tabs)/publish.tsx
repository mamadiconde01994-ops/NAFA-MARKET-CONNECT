import { router } from "expo-router";
import { useEffect } from "react";

export default function PublishScreen() {
  useEffect(() => {
    router.replace("/" as any);
  }, []);
  return null;
}
