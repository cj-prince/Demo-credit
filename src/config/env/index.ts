import development from './development';
import test from './test';
import { JwtSignature } from '../../shared/interface';

export const JwtSignOptions: JwtSignature = {
  issuer: "Democredit",
  subject: "Authentication Token",
  audience: "https://democredit.com",
};


export default {
  development,
  test,
}[process.env.DEMOCREDIT_NODE_ENV || "development"];
