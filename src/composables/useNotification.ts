import CustomNotification from './CustomNotification.vue';

export function useNotification(notificationRef: InstanceType<typeof CustomNotification> | null) {
    if (notificationRef !== null) {
        notificationRef.displayNotification();
        setTimeout(() => {
            notificationRef.hideNotification();
        }, 3000);
    }
}