import * as version from "../../../modules/clients-side/version.js";
import * as password from "./password.js";
import * as readDatabase from "./read-db.js";
import * as writeDatabase from "./write-db.js";
import * as processor from "./processor.js";

export const socket = io();

version.requestVersion(socket);
password.handle();
readDatabase.handle();
writeDatabase.handle();
processor.handle();
