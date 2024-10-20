import * as version from "../../../modules/clients-side/version.js";
import * as password from "./password.js";
import * as processor from "./processor.js";
import * as funcs from "./funcs.js";
import * as chat from "./chat.js";
import * as start from "./round/start.js";
import * as obstacle from "./round/obstacle.js";
import * as acceleration from "./round/acceleration.js";
import * as finish from "./round/finish.js";
import * as subFinish from "./round/sub-finish.js";
import * as outsideMedia from "./outside-media.js";

export const socket = io();
export var roundID;

export const updateRoundID = (id) => {
    roundID = id;
};

version.requestVersion(socket);
password.handle();
processor.handle();
funcs.assignButton();
chat.handle();
start.handle();
obstacle.handle();
acceleration.handle();
finish.handle();
subFinish.handle();
outsideMedia.handle();
