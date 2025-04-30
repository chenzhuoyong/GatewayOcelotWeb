import { reactive } from "vue";
import { defaultGateway } from "./helper";
import { GatewayConfig } from "./type";

const state = reactive<GatewayConfig>({ ...defaultGateway });

const setGateway = (newGateway: GatewayConfig): void => {
  state.Config = newGateway.Config;
  state.Id = newGateway.Id;
  state.ProjectCode = newGateway.ProjectCode;
  state.ProjectName = newGateway.ProjectName;
};

export function useStore() {
  return { state, setGateway };
}
