'use client';

import { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        let requestRef: number;
        let mouseX = 0;
        let mouseY = 0;

        // Smooth follow setup
        const animateCursor = () => {
            // Direct update for responsiveness, can add lerp for smoothing if desired
            // For now, setting directly is most accurate to the pointer
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;

            requestRef = requestAnimationFrame(animateCursor);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if the element is interactive
            const isInteractive = target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]');

            if (isInteractive) {
                document.body.classList.add('cursor-hovering');
            } else {
                document.body.classList.remove('cursor-hovering');
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        requestRef = requestAnimationFrame(animateCursor);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(requestRef);
            // Clean up class
            document.body.classList.remove('cursor-hovering');
        };
    }, []);

    return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
};

export default CustomCursor;
