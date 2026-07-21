"use client";

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
    target: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}

export default function AnimatedCounter({
    target,
    duration = 2000,
    suffix = "",
    prefix = "",
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentCount = Math.floor(progress * target);
            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [target, duration]);

    return (
        <span>
            {prefix}
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}