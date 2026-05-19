import { Router } from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
} from "../controllers/leadController";
import { protect } from "../middleware/authMiddleware";

const router = Router();


router.use(protect);

router.route("/").get(getLeads).post(createLead);

router.get('/export', exportLeads);

router.route("/:id").get(getLeadById).put(updateLead).delete(deleteLead);



export default router;
