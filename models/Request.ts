import mongoose from "mongoose"

const requestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned"],
      default: "pending",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: (v: Date) => v > new Date(),
        message: "Due date must be in the future",
      },
    },
    returnDate: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

requestSchema.index({ requesterId: 1, status: 1 })
requestSchema.index({ equipmentId: 1, status: 1 })
requestSchema.index({ dueDate: 1, status: 1 })
requestSchema.index({ requestDate: -1 })

export default mongoose.models.Request || mongoose.model("Request", requestSchema)
