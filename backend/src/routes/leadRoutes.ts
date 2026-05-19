import { Router } from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/leadController";
import { protect } from "../middleware/authMiddleware";

const router = Router();


router.use(protect);

router.route("/").get(getLeads).post(createLead);


router.route("/:id").get(getLeadById).put(updateLead).delete(deleteLead);

export default router;
