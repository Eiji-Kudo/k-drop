import { Colors } from '@/constants/Colors'
import {
  toast,
  ToastOptions,
  ToastPosition,
} from '@backpackapp-io/react-native-toast'

const DEFAULT_DURATION = 5000

/**
 * 通常のトーストメッセージを表示する
 * @param message 表示するメッセージ
 * @param options その他のトーストオプション
 */
// eslint-disable-next-line import/no-unused-modules
export const showToast = (message: string, options?: Partial<ToastOptions>) => {
  toast(message, {
    position: ToastPosition.BOTTOM,
    styles: {
      view: {
        backgroundColor: Colors.white,
      },
      text: {
        color: Colors.toastSuccess,
      },
    },
    duration: DEFAULT_DURATION,
    ...options,
  })
}

/**
 * 画面の下部にエラートーストを表示する
 * @param message 表示するエラーメッセージ
 * @param options その他のトーストオプション
 */
export const showErrorToast = (
  message: string,
  options?: Partial<ToastOptions>,
) => {
  toast.error(message, {
    position: ToastPosition.BOTTOM,
    styles: {
      view: {
        backgroundColor: Colors.white,
      },
      text: {
        color: Colors.toastError,
      },
    },
    duration: DEFAULT_DURATION,
    ...options,
  })
}
