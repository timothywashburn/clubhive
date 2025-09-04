import { toast, ToastOptions, Id } from 'react-toastify';

interface UseToastReturn {
    successToast: (message: string) => Id;
    errorToast: (message: string) => Id;
    infoToast: (message: string) => Id;
    warningToast: (message: string) => Id;
    loadingToast: (message: string) => Id;
    dismiss: (toastId?: Id) => void;
    dismissAll: () => void;
}

export const useToast = (): UseToastReturn => {
    const showToast = (type: 'success' | 'error' | 'info' | 'warning' | 'loading', message: string): Id => {
        const defaultConfig: ToastOptions = {
            position: 'bottom-right',
            autoClose: type === 'loading' ? false : 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        };

        return toast[type](message, defaultConfig);
    };

    return {
        successToast: (message: string) => showToast('success', message),
        errorToast: (message: string) => showToast('error', message),
        infoToast: (message: string) => showToast('info', message),
        warningToast: (message: string) => showToast('warning', message),
        loadingToast: (message: string) => showToast('loading', message),
        dismiss: (toastId?: Id) => toast.dismiss(toastId),
        dismissAll: () => toast.dismiss(),
    };
};
