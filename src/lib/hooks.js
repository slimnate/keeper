import { useEffect, useRef, useState } from "react";

export function useOnScreen(rootRef, elemsRef, indexToWatch) {
    const [isOnScreen, setIsIonScreen] = useState(true);
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(([entry]) => {
            console.log(`setIsOnScreen(${entry.isIntersecting})`);
            setIsIonScreen(entry.isIntersecting);
        }, {
            root: rootRef.current
        });
    })

    useEffect(() => {
        console.log('observer attached to: ')
        console.log(elemsRef.current[indexToWatch]);
        observerRef.current.observe(elemsRef.current[indexToWatch]);

        return () => observerRef.current.disconnect();
    }, [indexToWatch, elemsRef]);

    console.log('hook - isOnScreen', isOnScreen);
    return isOnScreen;
}

export function useWatchProgress(loading) {
    const [progress, setProgress] = useState(false);

    if(!loading) {
        return false;
    }

    const handleUpdateProgress = (event, progress) => {
        console.log('progress updated');
        console.log(progress);
        setProgress(progress);
    }

    window.progress.onUpdateProgress(handleUpdateProgress);
    return progress;
}