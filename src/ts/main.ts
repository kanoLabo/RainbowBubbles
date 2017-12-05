import ParticleCreator1 from "./particle/ParticleCreator1";
import {ParticleSettingData} from "./particle/ParticleSettingData";

const settingData = new ParticleSettingData();
addEventListener("DOMContentLoaded", () => new ParticleCreator1().init(settingData));