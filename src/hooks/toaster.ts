import { useState, useCallback } from 'react';
import { throttle } from 'lodash';


const useToaster = (delay = 3000) => {
    const [isToastVisible, setIsToastVisible] = useState(false);
    let timer: any = null
    const showToast = useCallback(
        throttle((message) => {
            setIsToastVisible(true);
            clearTimeout(timer)
            timer = setTimeout(() => {
                setIsToastVisible(false)
            }, 1000);
        }, delay),

        [delay]
    );

    return { isToastVisible, showToast, setIsToastVisible };
};

export default useToaster;