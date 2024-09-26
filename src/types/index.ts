import type { Newtype } from "newtype-ts";
import { newtypeZ } from "./utils";
import { z } from "zod";

/** id for card, use {@link newtypeZ} wrap */
export interface CardId
  extends Newtype<{ readonly CardId: unique symbol }, number> {}
export const CardId = newtypeZ(z.string());
