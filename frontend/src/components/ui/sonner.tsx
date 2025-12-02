import * as React from "react";
import { Toast as PrimeToast } from "primereact/toast";

// Create a toast ref that can be used globally
export const toastRef = React.createRef<PrimeToast>();

export const Toaster = () => {
  return <PrimeToast ref={toastRef} position="bottom-right" />;
};

// Helper function to show toast messages with proper PrimeIcons
export const toast = {
  success: (message: string, detail?: string) => {
    toastRef.current?.show({
      severity: "success",
      summary: message,
      detail,
      life: 4000,
      icon: 'pi pi-check-circle'
    });
  },
  error: (message: string, detail?: string) => {
    toastRef.current?.show({
      severity: "error",
      summary: message,
      detail,
      life: 5000,
      icon: 'pi pi-times-circle'
    });
  },
  info: (message: string, detail?: string) => {
    toastRef.current?.show({
      severity: "info",
      summary: message,
      detail,
      life: 4000,
      icon: 'pi pi-info-circle'
    });
  },
  warning: (message: string, detail?: string) => {
    toastRef.current?.show({
      severity: "warn",
      summary: message,
      detail,
      life: 4000,
      icon: 'pi pi-exclamation-triangle'
    });
  },
};
