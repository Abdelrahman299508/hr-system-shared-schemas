import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PositionDocument = Position & Document;

@Schema({ timestamps: true, collection: 'positions' })
export class Position {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  positionCode: string;

  @Prop({ required: true, trim: true })
  positionTitle: string;

  @Prop({ trim: true })
  positionTitleArabic?: string;

  @Prop()
  description?: string;

  // Organizational Placement
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Department', required: true })
  departmentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Position' })
  reportsToPositionId?: MongooseSchema.Types.ObjectId;

  // Position Details
  @Prop({ required: true, trim: true })
  level: string; // e.g., "Junior", "Mid", "Senior", "Lead", "Manager"

  @Prop()
  jobFamily?: string; // e.g., "Engineering", "Sales", "HR"

  // Compensation
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'PayGrade', required: true })
  payGradeId: MongooseSchema.Types.ObjectId;

  // Headcount
  @Prop({ required: true, default: 1 })
  headcountBudget: number;

  @Prop({ default: 0 })
  currentHeadcount: number;

  // Status
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  effectiveDate: Date;

  @Prop()
  endDate?: Date;

  // Metadata
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  updatedBy: MongooseSchema.Types.ObjectId;
}

export const PositionSchema = SchemaFactory.createForClass(Position);

// Indexes
PositionSchema.index({ positionCode: 1 }, { unique: true });
PositionSchema.index({ departmentId: 1 });
PositionSchema.index({ reportsToPositionId: 1 });
PositionSchema.index({ isActive: 1 });
PositionSchema.index({ level: 1 });
PositionSchema.index({ jobFamily: 1 });

// Virtual for available headcount
PositionSchema.virtual('availableHeadcount').get(function (this: PositionDocument) {
  return this.headcountBudget - this.currentHeadcount;
});

// Ensure virtuals are included in toJSON
PositionSchema.set('toJSON', { virtuals: true });
PositionSchema.set('toObject', { virtuals: true });

