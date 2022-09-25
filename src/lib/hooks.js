import { useEffect, useRef, useState } from "react";

export function useOnScreen(rootRef, elemRef) {
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
        console.log('observer attached')
        observerRef.current.observe(elemRef.current);

        return () => observerRef.current.disconnect();
    }, [elemRef]);

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