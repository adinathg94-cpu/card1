"use client";

import Link from "next/link";
import { FaLock } from "react-icons/fa6";

interface LockedFeatureProps {
    title: string;
}

export default function LockedFeature({ title }: LockedFeatureProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full mb-6">
                <FaLock className="text-6xl text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
                This module is currently locked. Please contact UserBX to activate this feature.
            </p>
            <Link
                href="mailto:support@userbx.ie"
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
            >
                Contact Support
            </Link>
        </div>
    );
}
