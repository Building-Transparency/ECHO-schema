import { z } from 'zod';
import phoneParse from "libphonenumber-js";
// @ts-ignore
import { randomUUID } from 'node:crypto';

export const Any = z.any();
export const Str = z.string();
export const StrOrNull = Str.nullable().default(null);
export const Url = Str.url();
export const UrlOrNull = Url.nullable().default(null);
export const Email = Str.email();
export const EmailOrNull = Email.nullable().default(null);
// TODO: confirm desired format of addresses
export const AddressLookup = Str;
export const AddressLookupOrNull = AddressLookup.nullable().default(null);
export const Id = Str.uuid();
export const IdDefault = Id.default(randomUUID);
export const DateISO = z.string().date();
export const DateISODefault = DateISO.default(() => (new Date()).toISOString().slice(0, 10));
export const DateISOOrNull = DateISO.nullable().default(null);
export const Year = z.coerce.number().int();
export const YearDefaultNow = Year.default(() => (new Date()).getUTCFullYear());
export const Num = z.number();
export const NumPos = Num.gt(0);
export const Lat = Num.gte(-90).lte(90);
export const Lon = Num.gte(-180).lte(180);
export const NumNonNeg = Num.gte(0);
export const NumNonNegOrNull = NumNonNeg.nullable().default(null);
export const NumPosOrNull = NumPos.nullable().default(null);
export const NumOrNull = Num.nullable().default(null);
export const Bool = z.boolean();
export const BoolOrNull = Bool.nullable().default(null);
export const BoolDefaultTrue = Bool.default(true);
export const BoolDefaultFalse = Bool.default(false);
export const Phone = Str.transform((args, ctx) => {
  // https://github.com/colinhacks/zod/issues/3378#issuecomment-2067591844
  const phone = phoneParse(args, { defaultCountry: "US" });
  if (!phone?.isValid()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid phone number",
    });
    return z.NEVER;
  }
  return phone.formatInternational();
});
export const PhoneOrNull = Phone.nullable().default(null);