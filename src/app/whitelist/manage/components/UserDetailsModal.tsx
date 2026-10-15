"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

export default function UserDetailsModal({
  user,
  statusLabels,
  onUpdateStatus,
  isOpen,
  onClose,
  isLoading,
}: {
  user: {
    discordId: string;
    username: string;
    status: string;
    answers: string | null;
  };
  statusLabels: Record<string, string>;
  onUpdateStatus: (discordId: string, newStatus: string) => Promise<boolean>;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}) {
  const [localStatus, setLocalStatus] = useState(user.status);

  const handleStatusChange = async (newStatus: string) => {
    setLocalStatus(newStatus);
    const success = await onUpdateStatus(user.discordId, newStatus);
    if (!success) {
      setLocalStatus(user.status);
      toast.error("Wystąpił błąd podczas zmiany statusu.");
    } else {
      toast.success("Status został zaktualizowany.");
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-base-content"
                >
                  Odpowiedzi użytkownika: {user.username}
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  {user.answers ? (
                    (() => {
                      try {
                        const answers = JSON.parse(user.answers) as Record<
                          string,
                          string
                        >;
                        return Object.entries(answers).map(
                          ([question, answer]) => (
                            <div
                              key={question}
                              className="border-b border-base-200 pb-2"
                            >
                              <h4 className="text-sm font-semibold text-base-content/80">
                                {question}
                              </h4>
                              <p className="text-sm text-base-content mt-1">
                                {answer}
                              </p>
                            </div>
                          ),
                        );
                      } catch (e) {
                        return (
                          <p className="text-sm text-error">
                            Błąd parsowania odpowiedzi.
                          </p>
                        );
                      }
                    })()
                  ) : (
                    <p className="text-sm text-base-content/70">
                      Brak odpowiedzi.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <label className="text-sm font-medium text-base-content">
                    Zmień status:
                  </label>
                  <select
                    value={localStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="select select-bordered w-full"
                    disabled={isLoading}
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-content hover:bg-primary-focus focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Zamknij
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
