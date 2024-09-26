import { type CarrierOf, iso, type Newtype, prism } from "newtype-ts";
import { z, type ZodType, type ZodTypeAny } from "zod";

export const newtypeZ = <
  // biome-ignore lint/suspicious/noExplicitAny: extends
  T extends Newtype<any, any>,
  SrcZ extends ZodTypeAny = ZodType<CarrierOf<T>>,
>(srcZ: SrcZ, prismFn?: Parameters<typeof prism<T>>[0]) => {
  const isoT = iso<T>();

  const newThisType = (val: CarrierOf<T>) => isoT.wrap(val);

  newThisType.iso = isoT;

  newThisType.unwrap = isoT.unwrap;

  newThisType.z = typeof prismFn === "function"
    ? srcZ.refine(prismFn).transform(isoT.wrap).or(
      z.custom<T>().refine((v) =>
        srcZ.safeParse(isoT.unwrap(v)).success && prismFn(isoT.unwrap(v))
      ),
    )
    : srcZ.transform(isoT.wrap).or(
      z.custom<T>().refine((v) => srcZ.safeParse(isoT.unwrap(v)).success),
    );

  newThisType.prism = prismFn && prism<T>(prismFn);

  return newThisType;
};
