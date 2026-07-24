import { LogOut } from "@/infra/core";
import { BiIcon, LoadingSubmit } from "@/shared/utils";
import { Session } from "next-auth";
import Image from "next/image";

export const Profile = ({ session }: { session: Session }) => {
  const { user } = session;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <form action={LogOut} className="relative normal-case">
      <dialog
        closedby="any"
        id="profile-dialog"
        popover=""
        className="m-auto p-6 max-w-sm bg-background-secondary/95 border border-card shadow-2xl backdrop:backdrop-blur-sm rounded-lg overflow-hidden [position-anchor:none]"
      >
        <figure className="flex items-center gap-4">
          {user?.image ? (
            <Image
              src={user.image}
              alt={(user.name ?? "User avatar") + " profile picture"}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover ring-1 ring-slate-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-linear-to-br from-lime-500 to-green-500 text-background font-semibold">
              {initials}
            </div>
          )}

          <dl className="flex-1">
            <dt className="text-sm text-slate-400">Signed in as</dt>
            <dd className="text-white font-medium">{user?.name}</dd>
            <dd className="text-xs text-slate-500 truncate">{user?.email}</dd>
          </dl>
        </figure>

        <LoadingSubmit
          text="Signing out..."
          className="w-full mt-4 px-3 py-2 rounded-md border border-red-500 text-red-500 hover:bg-btn transition-colors focus-visible:bg-btn focus-visible:outline-red-500 focus-visible:outline action-btn"
        >
          Sign out
        </LoadingSubmit>
      </dialog>

      <button
        type="button"
        commandfor="profile-dialog"
        command="show-modal"
        className="inline-flex items-center gap-2 bg-lime-500 text-background hover:bg-transparent hover:outline hover:text-lime-500 focus-visible:bg-transparent focus-visible:outline focus-visible:text-lime-500 px-3 py-2 rounded-md"
        aria-label="Open account menu"
      >
        {user?.name} <BiIcon name="person" />
      </button>
    </form>
  );
};
