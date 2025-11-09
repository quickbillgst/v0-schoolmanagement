import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    type: {
      type: String,
      enum: ["due-date-reminder", "overdue-alert", "return-reminder", "approved", "rejected"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    daysUntilDue: {
      type: Number,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema)
