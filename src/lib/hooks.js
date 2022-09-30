import { useEffect, useRef, useState } from "react";

export function useOnScreen(rootRef, elemsRef, indexToWatch) {
    const [isOnScreen, setIsIonScreen] = useState(true);
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(([entry]) => {
            if(elemsRef.current[indexToWatch].id === entry.target.id){
                console.log(`${entry.target.id} - setIsOnScreen(${entry.isIntersecting})`);
                setIsIonScreen(entry.isIntersecting);
            }
        }, {
            root: rootRef.current,
            threshold: 1,
        });
    })

    useEffect(() => {
        const elemRef = elemsRef.current[indexToWatch];
        if (!elemRef) return;

        console.log('observer attached to: ', elemRef.id)
        observerRef.current.observe(elemRef);

        return () => {
            console.log('unobserving: ', elemRef.id);
            observerRef.current.unobserve(elemRef);
            observerRef.current.disconnect();
        }
    }, [indexToWatch, elemsRef]);

    console.log(`hook - isOnScreen(${indexToWatch})`, isOnScreen);
    return isOnScreen;
}

export function useWatchProgress(loading) {
    const [progress, setProgress] = useState(false);

    if(!loading) {
        return false;
    }

    const handleUpdateProgress = (event, progress) => {
        setProgress(progress);
    }

    window.progress.onUpdateProgress(handleUpdateProgress);
    return progress;
}