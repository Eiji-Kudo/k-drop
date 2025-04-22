import { Colors } from '@/constants/Colors'
import { toast, ToastOptions, ToastPosition } from '@backpackapp-io/react-native-toast'

/**
 * 画面の下部にエラートーストを表示する
 * @param message 表示するエラーメッセージ
 * @param options その他のトーストオプション
 */
export const showErrorToast = (message: string, options?: Partial<ToastOptions>) => {
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
    duration: 5000,
    ...options,
  })
}

/**
 * 通常のトーストメッセージを表示する
 * @param message 表示するメッセージ
 * @param options その他のトーストオプション
 */
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
    ...options,
  })
}
