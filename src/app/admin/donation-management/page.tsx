"use client";

import AdminLayout from "../components/AdminLayout";
import LockedFeature from "../components/LockedFeature";

export default function DonationManagementPage() {
    return (
        <AdminLayout>
            <LockedFeature title="Donation Management" />
        </AdminLayout>
    );
}
