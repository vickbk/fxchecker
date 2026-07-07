import { LogOut } from "@/infra/core";
import { BiIcon } from "@/shared/utils";
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
    <form action={LogOut} className="relative">
      <dialog
        closedby="any"
        id="profile-dialog"
        popover=""
        className="m-auto p-6 max-w-sm bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl rounded-lg overflow-hidden"
      >
        <div className="flex items-center gap-4">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "User avatar"}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover ring-1 ring-slate-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-linear-to-br from-slate-700 to-slate-800 text-white font-semibold">
              {initials}
            </div>
          )}

          <div className="flex-1">
            <div className="text-sm text-slate-400">Signed in as</div>
            <div className="text-white font-medium">{user?.name}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 px-3 py-2 rounded-md border border-slate-700 text-red-400 hover:bg-slate-800 transition-colors"
        >
          Sign out
        </button>
      </dialog>

      <button
        type="button"
        popoverTarget="profile-dialog"
        className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-md"
        aria-label="Open account menu"
      >
        {user?.name} <BiIcon name="user" />
      </button>
    </form>
  );
};
