"use client";

export function ConfirmStep() {
  return (
    <div className="flex flex-col gap-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Imię</span>
        </label>
        <input
          type="text"
          name="name"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Email</span>
        </label>
        <input
          type="email"
          name="email"
          className="input input-bordered w-full"
          required
        />
      </div>
    </div>
  );
}
