// Enregistre une entrée dans le journal d'activité (ActivityLog). Ne doit
// jamais faire échouer l'action métier en cours : toute erreur est avalée et
// juste loggée.
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger";

export const ActivityAction = {
  MEMBER_REGISTERED: "MEMBER_REGISTERED",
  MEMBER_APPROVED: "MEMBER_APPROVED",
  MEMBER_REJECTED: "MEMBER_REJECTED",
  PRODUCT_CREATED: "PRODUCT_CREATED",
  PRODUCT_UPDATED: "PRODUCT_UPDATED",
  PRODUCT_REASSIGNED: "PRODUCT_REASSIGNED",
  PRODUCT_DELETED: "PRODUCT_DELETED",
  ORDER_CREATED: "ORDER_CREATED",
  ORDER_STATUS_CHANGED: "ORDER_STATUS_CHANGED",
};

export async function logActivity({
  actorId,
  action,
  targetType,
  targetId,
  metadata,
}) {
  try {
    await prisma.activityLog.create({
      data: {
        actorId: actorId || null,
        action,
        targetType: targetType || null,
        targetId: targetId || null,
        metadata: metadata || undefined,
      },
    });
  } catch (error) {
    await logError(error, {
      metadata: { context: "logActivity", action, targetType, targetId },
    });
  }
}
