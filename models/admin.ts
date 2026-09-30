import mongoose, { Schema } from "mongoose";

export interface IAdmin {
  email: string;
  passwordHash: string;
  name: string;
  role: "admin";
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  resetTokenHash?: string;
  resetTokenExpiresAt?: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    active: { type: Boolean, default: true },
    resetTokenHash: { type: String, select: false },
    resetTokenExpiresAt: { type: Date, select: false },
  },
  { timestamps: true },
);

const AdminModel = mongoose.models.Admin as mongoose.Model<IAdmin> | undefined;
export const Admin: mongoose.Model<IAdmin> = AdminModel ?? mongoose.model<IAdmin>("Admin", adminSchema);
