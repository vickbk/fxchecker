/**
 * @fileactor Mixed - Auth type definitions
 * Type declarations used by the core auth utilities. These types are runtime
 * agnostic but are consumed primarily by server-side auth helpers.
 */

import { Account, Profile, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

/**
 * SignInProps - parameters forwarded to the `signIn` callback.
 */
export type SignInProps = {
  account?: Account | null;
  profile?: Profile;
};

/**
 * AuthToken - application augmentation of the raw JWT token.
 */
export type AuthToken = JWT & {
  id?: string;
};

/**
 * JWTProps - parameters passed to the jwt callback.
 */
export type JWTProps = {
  token: JWT;
  user: User | AdapterUser;
  account?: Account | null;
  profile?: Profile;
};

/**
 * SessionProps - parameters passed to the session callback.
 */
export type SessionProps = {
  session: Session;
  token: AuthToken;
};
