import 'izitoast/dist/css/iziToast.css';

import iziToast from 'izitoast';
import { warningIcon } from 'assets/images';

iziToast.settings({
  timeout: 6000,
  resetOnHover: true,
  progressBar: false,
  transitionIn: 'fadeInUp',
  transitionOut: 'fadeOutDown',
  position: 'topRight',
  displayMode: 2,
});

/**
 * Success message handler for toast.
 *
 * @param {{string, string}} { Title, message }.
 */
export function success({ title = 'Success', message }: { title?: string; message: string }): void {
  iziToast.success({
    title,
    message,
  });
}

/**
 * Warning message handler for toast.
 *
 * @param {{string, string}} { Title, message }.
 */
export function error({ title, message }: { title: string; message: string }): void {
  iziToast.error({
    title,
    message,
    titleColor: '#FF1E00',
    messageColor: '#FF1E00',
    backgroundColor: 'white',
    class: 'custom-toast__error',
    iconUrl: warningIcon,
  });
}

/**
 * Error message handler for toast.
 *
 * @param {{string, string}} { Title, message }.
 */
export function warning({ title, message }: { title: string; message: string }): void {
  iziToast.warning({
    title,
    message,
  });
}
