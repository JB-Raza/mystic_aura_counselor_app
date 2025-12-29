import { ConfirmationDialog } from '@/components/Modals';
import { useState, createContext, useCallback, useContext } from 'react';

const ConfirmationAlertContext = createContext()

export const useConfirmationAlert = () => {
    const context = useContext(ConfirmationAlertContext)

    if (!context) {
        throw new Error('useConfirmation must be used within a ConfirmationProvider')
    }
    return context
}

export const ConfirmationAlertProvider = ({ children }) => {
    const [confirmation, setConfirmation] = useState({
        visible: false,
        title: "",
        message: "",
        onConfirm: () => { },
        onCancel: () => { },
        confirmText: "Confirm",
        cancelText: "Cancel",
        type: "warning" // 'danger', 'warning', 'info'
    })

    const showConfirmation = useCallback(({title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "danger"}) => {
        setConfirmation({
            visible: true,
            title,
            message,
            onConfirm,
            onCancel,
            confirmText,
            cancelText,
            type
        })
    }, [])

    const hideConfirmation = useCallback(() => {
        setConfirmation({
            visible: false,
            title: "",
            message: "",
            onConfirm: () => { },
            onCancel: () => { },
            confirmText: "Confirm",
            cancelText: "Cancel",
            type: "danger"
        })
    }, [])

    return (
        <ConfirmationAlertContext.Provider value={{ confirmation, showConfirmation, hideConfirmation }}>
            {children}
            <ConfirmationDialog
                visible={confirmation.visible}
                title={confirmation.title}
                message={confirmation.message}
                onConfirm={confirmation.onConfirm}
                onCancel={confirmation.onCancel}
                confirmText={confirmation.confirmText}
                cancelText={confirmation.cancelText}
                type={confirmation.type} />

        </ConfirmationAlertContext.Provider>
    )
}
