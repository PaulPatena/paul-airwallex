"use client";
import { useState } from "react";
import Modal from "./components/modal";
import InviteForm from "./components/invite-form";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="h-full flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-accent">Our Amazing App</span>
        </h1>
        <p className="text-lg mb-8">
          Discover a new way to experience{" "}
          <span className="font-semibold">efficiency</span> and{" "}
          <span className="font-semibold">collaboration</span>. Join us and be
          part of the future.
        </p>

        {/* Request Invite Button */}
        <button
          className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-highlight transition-all duration-300"
          onClick={() => setIsModalOpen((prev) => !prev)}
        >
          Request an Invite
        </button>
      </div>
      {/* Modal with Invite Form */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InviteForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </section>
  );
}
