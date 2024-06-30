import Joi from "joi";

export const fundAccountPayloadValidatorSchema = Joi.object().keys({
  amount: Joi.string().required(),
  wallet_number: Joi.string().required(),
});

export const transferFundAccountPayloadValidatorSchema = Joi.object().keys({
  amount: Joi.string().required(),
  wallet_number: Joi.string().required(),
});

export const withdrawFundPayloadValidatorSchema = Joi.object().keys({
  amount: Joi.string().required(),
});