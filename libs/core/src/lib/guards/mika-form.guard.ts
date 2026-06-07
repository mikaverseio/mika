import { MikaFormLeaveConfig, MikaFormLeaveContext, MikaLeaveDecision } from '../schema';

export function mikaFormGuard(ctx: MikaFormLeaveContext): MikaLeaveDecision {
  if (!ctx.dirty) return { kind: 'allow' };

  const cfg: MikaFormLeaveConfig = {
    confirmLeave: true,
    autoSaveOnLeave: false,
    ...(ctx.config ?? {}),
  };

  if (cfg.autoSaveOnLeave && ctx.hasSubmitHandler) {
    return { kind: 'autosave' };
  }

  if (cfg.confirmLeave === false) {
    return { kind: 'allow' };
  }

  return {
    kind: 'confirm',
    messageKey: cfg.confirmLeaveMessage ?? 'mf-leave-confirmation',
  };
}
