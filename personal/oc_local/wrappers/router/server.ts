import {join,isAbsolute} from "node:path";
import router from "../../src/opencode-model-router/src/v2.ts";
import {overridePath,statePath,loadConfig} from "../../src/opencode-model-router/src/router/config.ts";
export default {...router,async setup(ctx){
const configHome=process.env.XDG_CONFIG_HOME;
if (!configHome || !isAbsolute(configHome)) throw new Error("Expected an absolute XDG_CONFIG_HOME");
const config=join(configHome,"opencode");
if(overridePath()!==join(config,"opencode-model-router.overrides.jsonc") || statePath()!==join(config,"opencode-model-router.state.json")) throw new Error("Router escaped selected configuration");
const cfg=loadConfig(ctx.location.directory);
const expected={fast:["openai/gpt-6.1-terra","low"],medium:["openai/gpt-6.2-sol","medium"],complex:["openai/gpt-6.2-sol","high"],heavy:["anthropic/claude-fable-5-2","max"]};
for(const [tier,[model,variant]] of Object.entries(expected)){const actual=cfg.presets.balanced[tier];if(actual.model!==model||actual.variant!==variant)throw new Error("Router tier settings differ: "+tier);}
for(const [tier,cap] of Object.entries({fast:8,medium:5,complex:5,heavy:3}))if(cfg.tierCaps?.[tier]!==cap)throw new Error("Router read cap differs: "+tier);
return router.setup(ctx);
}};
