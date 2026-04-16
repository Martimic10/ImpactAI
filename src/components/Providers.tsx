"use client";

import { createContext, useContext, useState } from "react";
import { AuthProvider } from "@/lib/auth";
import { AuthModal } from "@/components/auth/AuthModal";

const ModalContext = createContext<{ openAuthModal: () => void }>({ openAuthModal: () => {} });

export function useOpenAuthModal() {
  return useContext(ModalContext).openAuthModal;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AuthProvider>
      <ModalContext.Provider value={{ openAuthModal: () => setModalOpen(true) }}>
        {children}
        <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </ModalContext.Provider>
    </AuthProvider>
  );
}
