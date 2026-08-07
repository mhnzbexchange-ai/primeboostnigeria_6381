import React from 'react';

export default function AdminAdvertisements() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold">Advertisements</h2>
          <p className="text-sm text-muted-foreground">
            Manage advertisements displayed on PrimeBoost Nigeria.
          </p>
        </div>

        <span className="badge-base status-pending">
          0 Pending
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Total Ads</p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="text-2xl font-bold mt-1">₦0</p>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <div className="text-3xl mb-3">📢</div>

        <h3 className="font-semibold">
          No advertisements yet
        </h3>

        <p className="text-sm text-muted-foreground mt-1">
          Advertisements submitted by businesses will appear here.
        </p>

        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Manage Advertisements
        </button>
      </div>
    </div>
  );
}
