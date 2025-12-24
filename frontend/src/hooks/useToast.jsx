import { Toast } from 'toastify-react-native';


export const useToast = () => {

    function showToast(type, text2) {

        return Toast.show({
            type: "success",
            text2: text2,
            position: 'top',
            visibilityTime: 5000,
            autoHide: true,
        });
    }
    return showToast
}