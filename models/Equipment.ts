import mongoose from "mongoose"

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add equipment name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["sports", "lab", "classroom", "multimedia", "library", "other"],
    },
    condition: {
      type: String,
      enum: ["excellent", "good", "fair", "poor"],
      default: "good",
    },
    quantity: {
      type: Number,
      required: [true, "Please add quantity"],
      min: [1, "Quantity must be at least 1"],
    },
    availableQuantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMaintenanceDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["available", "maintenance", "archived"],
      default: "available",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

equipmentSchema.pre("save", function (next) {
  if (this.isNew && !this.availableQuantity) {
    this.availableQuantity = this.quantity
  }

  // Validate that availableQuantity never exceeds quantity
  if (this.availableQuantity > this.quantity) {
    this.availableQuantity = this.quantity
  }

  if (this.availableQuantity < 0) {
    this.availableQuantity = 0
  }

  next()
})

export default mongoose.models.Equipment || mongoose.model("Equipment", equipmentSchema)
