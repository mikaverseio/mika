export interface MikaAlertRef {
  present(): Promise<void>;
  dismiss(role?: string): Promise<void>;
}
