import ParticleCreator1 from "./particle/ParticleCreator1";
import {ParticleSettingData} from "./particle/ParticleSettingData";

const settingData = new ParticleSettingData();

settingData.bounse = false;
settingData.bgColor = ["#CB9B0C", "#FFFCD1"];
addEventListener("DOMContentLoaded", () => new ParticleCreator1().init(settingData));