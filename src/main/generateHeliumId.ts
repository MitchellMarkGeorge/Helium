import { HeliumId } from "common/types";
import crypto from 'crypto';

export const generateHeliumId = (): HeliumId => `helium-${crypto.randomUUID()}`;