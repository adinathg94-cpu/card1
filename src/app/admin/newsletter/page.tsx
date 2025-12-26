"use client";

import AdminLayout from "../components/AdminLayout";
import LockedFeature from "../components/LockedFeature";

export default function NewsletterPage() {
    return (
        <AdminLayout>
            <LockedFeature title="Newsletter" />
        </AdminLayout>
    );
}

